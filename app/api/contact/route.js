import { SERVICE_CHOICES } from "@/content/settings";
import { createRateLimiter, formatEnquiry, parseEnquiry } from "@/lib/contact";

const isLimited = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const reply = (status, body) => Response.json(body, { status });
const FAILED = "Couldn't send that just now. Try again, or email Alex directly.";

export async function POST(request) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (isLimited(ip)) {
        return reply(429, { ok: false, error: "That's a few enquiries in a row. Give it ten minutes, or email Alex directly." });
    }

    let input;
    try {
        input = await request.json();
    } catch {
        return reply(400, { ok: false, error: "Something went wrong with the form. Refresh and try again." });
    }

    const { data, error, field } = parseEnquiry(input);
    // Bots get a success response so they don't retry.
    if (error === "spam") return reply(200, { ok: true });
    if (error) return reply(422, { ok: false, error, field });

    const serviceLabel = SERVICE_CHOICES.find((choice) => choice.id === data.service)?.label;
    const mail = formatEnquiry(data, serviceLabel);
    const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;

    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
        if (process.env.NODE_ENV !== "production") {
            console.info("[contact] Email not configured, enquiry logged instead:\n" + mail.text);
            return reply(200, { ok: true });
        }
        console.error("[contact] RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is not set");
        return reply(503, { ok: false, error: FAILED });
    }

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: CONTACT_FROM_EMAIL,
                to: CONTACT_TO_EMAIL,
                reply_to: data.email,
                subject: mail.subject,
                text: mail.text,
                html: mail.html,
            }),
        });
        if (!response.ok) {
            console.error(`[contact] Resend responded ${response.status}: ${await response.text()}`);
            return reply(502, { ok: false, error: FAILED });
        }
        return reply(200, { ok: true });
    } catch (sendError) {
        console.error("[contact] Resend request failed", sendError);
        return reply(502, { ok: false, error: FAILED });
    }
}
