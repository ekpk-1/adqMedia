import { describe, expect, it } from "vitest";
import { createRateLimiter, formatEnquiry, parseEnquiry } from "./contact";

const valid = { name: "Rush", email: "rush@example.com", message: "White M3, free on weekends." };

describe("parseEnquiry", () => {
    it("accepts a minimal enquiry and trims text", () => {
        expect(parseEnquiry({ ...valid, name: "  Rush  " }).data.name).toBe("Rush");
    });

    it("reports the first invalid field with a friendly message", () => {
        expect(parseEnquiry({ ...valid, email: "nope" })).toEqual({ error: "Check your email address", field: "email" });
        expect(parseEnquiry({ ...valid, message: "   " }).field).toBe("message");
    });

    it("flags a filled honeypot as spam", () => {
        expect(parseEnquiry({ ...valid, company: "Acme" })).toEqual({ error: "spam", field: "company" });
    });

    it("rejects unknown services and malformed project slugs", () => {
        expect(parseEnquiry({ ...valid, service: "wedding" }).field).toBe("service");
        expect(parseEnquiry({ ...valid, project: "../etc" }).field).toBe("project");
    });
});

describe("createRateLimiter", () => {
    it("allows up to the limit per window, then resets", () => {
        let time = 0;
        const isLimited = createRateLimiter({ limit: 2, windowMs: 1000, now: () => time });
        expect([isLimited("a"), isLimited("a"), isLimited("a")]).toEqual([false, false, true]);
        expect(isLimited("b")).toBe(false);
        time = 1000;
        expect(isLimited("a")).toBe(false);
    });
});

describe("formatEnquiry", () => {
    it("escapes HTML and includes the project link", () => {
        const mail = formatEnquiry({ ...valid, name: "<b>Rush</b>", project: "rushs-m3" }, "Pre-sale photos");
        expect(mail.html).not.toContain("<b>");
        expect(mail.text).toContain("Looking for: Pre-sale photos");
        expect(mail.text).toContain("/work/rushs-m3");
    });
});
