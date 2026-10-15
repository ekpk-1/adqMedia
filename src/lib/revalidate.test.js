import { describe, expect, it } from "vitest";
import { secretMatches, slugFromWebhook } from "./revalidate";

describe("secretMatches", () => {
    it("accepts the configured secret", () => {
        expect(secretMatches("correct-horse", "correct-horse")).toBe(true);
    });

    it("rejects a missing, wrong, or different-length secret", () => {
        expect(secretMatches(undefined, "correct-horse")).toBe(false);
        expect(secretMatches("nope", "correct-horse")).toBe(false);
        expect(secretMatches("correct-horse!", "correct-horse")).toBe(false);
        expect(secretMatches("", "")).toBe(false);
    });
});

describe("slugFromWebhook", () => {
    it("reads a slug string or a Sanity slug object", () => {
        expect(slugFromWebhook({ slug: "rushs-m3" })).toBe("rushs-m3");
        expect(slugFromWebhook({ slug: { current: "detailx" } })).toBe("detailx");
        expect(slugFromWebhook({ result: { slug: { current: "m2" } } })).toBe("m2");
    });

    it("ignores anything that is not a project slug", () => {
        expect(slugFromWebhook({})).toBeNull();
        expect(slugFromWebhook({ slug: "../admin" })).toBeNull();
        expect(slugFromWebhook({ slug: 12 })).toBeNull();
    });
});
