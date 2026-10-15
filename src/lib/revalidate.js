import { timingSafeEqual } from "node:crypto";

/** Constant-time check of the secret Sanity sends on the publish webhook. */
export function secretMatches(provided, expected) {
    if (!provided || !expected) return false;
    const left = Buffer.from(String(provided));
    const right = Buffer.from(String(expected));
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
}

/** Slug from the shapes a Sanity webhook might send. */
export function slugFromWebhook(body) {
    const value = body?.slug?.current ?? body?.slug ?? body?.result?.slug?.current ?? body?.result?.slug;
    return typeof value === "string" && /^[a-z0-9-]+$/.test(value) ? value : null;
}
