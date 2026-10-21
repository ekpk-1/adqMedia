import { z } from "zod";
import { renderMail } from "./mail";

const SITE = "https://adqmedia.au";

export const SERVICE_IDS = ["pre-sale", "social", "other"];

export const enquirySchema = z.object({
    name: z.string().trim().min(1, "Add your name").max(120),
    email: z.email("Check your email address").max(200),
    service: z.enum(SERVICE_IDS).optional(),
    message: z.string().trim().min(1, "Tell Alex a little about the car").max(4000),
    project: z
        .string()
        .regex(/^[a-z0-9-]{1,80}$/)
        .optional(),
    // Honeypot. Real visitors never see this field, so anything in it is a bot.
    company: z.string().max(0).optional(),
});

/** Validates a raw enquiry. Returns `{ data }` or `{ error, field }` with a visitor-facing message. */
export function parseEnquiry(input) {
    const result = enquirySchema.safeParse(input);
    if (result.success) return { data: result.data };
    const issue = result.error.issues[0];
    const field = String(issue.path[0] ?? "");
    if (field === "company") return { error: "spam", field };
    return { error: issue.message, field };
}

const clientIp = (request) =>
    request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

/**
 * Uses the shared Vercel Firewall rule `contact-enquiry` in production.
 * That rule is 5 requests per 10 minutes per IP, counted per region.
 * Development, and a missing rule, fall back to the in-memory limiter.
 */
export async function enquiryIsLimited(request, { check, memory, production }) {
    const ip = clientIp(request);
    if (!production) return memory(ip);
    try {
        const result = await check(request);
        if (!result || result.error === "not-found") return memory(ip);
        return result.rateLimited;
    } catch (error) {
        console.error("[contact] Shared rate limit unavailable", error instanceof Error ? error.message : error);
        return memory(ip);
    }
}

/** Fixed-window limiter kept in memory, so it resets per server instance. */
export function createRateLimiter({ limit, windowMs, now = Date.now }) {
    const hits = new Map();
    return function isLimited(key) {
        const time = now();
        if (hits.size > 500) {
            for (const [staleKey, stale] of hits) {
                if (time - stale.start >= windowMs) hits.delete(staleKey);
            }
        }
        const entry = hits.get(key);
        if (!entry || time - entry.start >= windowMs) {
            hits.set(key, { start: time, count: 1 });
            return false;
        }
        hits.set(key, { start: entry.start, count: entry.count + 1 });
        return entry.count + 1 > limit;
    };
}

const present = (line) => line !== null;
const firstName = (name) => name.trim().split(/\s+/)[0];

/** Plain-text and HTML bodies for the email Alex receives. */
export function formatEnquiry({ name, email, message, project }, serviceLabel) {
    const projectUrl = project ? `${SITE}/work/${project}` : null;
    const lines = [
        `Name: ${name}`,
        `Email: ${email}`,
        serviceLabel ? `Looking for: ${serviceLabel}` : null,
        projectUrl ? `From project: ${projectUrl}` : null,
        "",
        message,
    ].filter(present);
    return {
        subject: `New enquiry from ${name}`,
        text: lines.join("\n"),
        html: renderMail({
            preheader: serviceLabel ? `${name} asked about ${serviceLabel}.` : `${name} sent an enquiry.`,
            eyebrow: "New enquiry",
            title: name,
            lines: ["Reply to this email and it goes straight to them."],
            facts: [
                { label: "Email", text: email, href: `mailto:${email}` },
                serviceLabel ? { label: "Looking for", text: serviceLabel } : null,
                projectUrl ? { label: "From project", text: "View the project", href: projectUrl } : null,
            ].filter(present),
            noteLabel: "About the car",
            note: message,
        }),
    };
}

/** Confirmation sent back to the person who filled in the form. */
export function formatConfirmation({ name, message }, serviceLabel) {
    const who = firstName(name);
    const lines = [
        `Hi ${who},`,
        "",
        "Alex has your enquiry and will reply, usually within a day.",
        serviceLabel ? `You asked about ${serviceLabel}.` : null,
        "",
        "You wrote:",
        message,
        "",
        "Reply to this email if you want to add something.",
    ].filter(present);
    return {
        subject: "Alex got your enquiry",
        text: lines.join("\n"),
        html: renderMail({
            preheader: "Alex has your enquiry and will reply, usually within a day.",
            eyebrow: "Enquiry received",
            title: `Thanks, ${who}.`,
            lines: [
                "Alex has this and will reply, usually within a day.",
                "Reply to this email if you want to add something.",
            ],
            facts: serviceLabel ? [{ label: "Looking for", text: serviceLabel }] : [],
            noteLabel: "You wrote",
            note: message,
        }),
    };
}
