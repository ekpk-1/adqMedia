import { z } from "zod";

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

const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

/** Plain-text and HTML bodies for the email Alex receives. */
export function formatEnquiry({ name, email, message, project }, serviceLabel) {
    const lines = [
        `Name: ${name}`,
        `Email: ${email}`,
        serviceLabel ? `Looking for: ${serviceLabel}` : null,
        project ? `From project: https://adqmedia.au/work/${project}` : null,
        "",
        message,
    ].filter((line) => line !== null);
    return {
        subject: `New enquiry from ${name}`,
        text: lines.join("\n"),
        html: lines.map((line) => (line ? `<p>${escapeHtml(line)}</p>` : "<br>")).join(""),
    };
}
