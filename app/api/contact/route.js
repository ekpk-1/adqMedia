import { SERVICE_CHOICES } from "@/content/settings";
import { createRateLimiter, formatConfirmation, formatEnquiry, parseEnquiry } from "@/lib/contact";

const isLimited = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const reply = (status, body) => Response.json(body, { status });
const FAILED = "Couldn't send that just now. Try again, or email Alex directly.";

async function sendEmail(apiKey, email) {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(email),
    });
    if (response.ok) return;
    const error = new Error(`Resend responded ${response.status}`);
    error.detail = await response.text();
    throw error;
}

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
    const enquiry = formatEnquiry(data, serviceLabel);
    const confirmation = formatConfirmation(data, serviceLabel);
    const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;

    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
        if (process.env.NODE_ENV !== "production") {
            console.info("[contact] Email not configured, enquiry logged instead:\n" + enquiry.text + "\n\n" + confirmation.text);
            return reply(200, { ok: true });
        }
        console.error("[contact] RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is not set");
        return reply(503, { ok: false, error: FAILED });
    }

    try {
        await sendEmail(RESEND_API_KEY, {
            from: CONTACT_FROM_EMAIL,
            to: CONTACT_TO_EMAIL,
            reply_to: data.email,
            subject: enquiry.subject,
            text: enquiry.text,
            html: enquiry.html,
        });
    } catch (sendError) {
        console.error("[contact] Enquiry email failed", sendError.detail ?? sendError);
        return reply(502, { ok: false, error: FAILED });
    }

    try {
        await sendEmail(RESEND_API_KEY, {
            from: CONTACT_FROM_EMAIL,
            to: data.email,
            reply_to: CONTACT_TO_EMAIL,
            subject: confirmation.subject,
            text: confirmation.text,
            html: confirmation.html,
        });
    } catch (sendError) {
        console.error("[contact] Confirmation email failed", sendError.detail ?? sendError);
    }

    return reply(200, { ok: true });
}
