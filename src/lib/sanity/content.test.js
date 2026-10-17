import { describe, expect, it } from "vitest";
import { contentRequest } from "./content";

describe("contentRequest", () => {
    it("asks for published documents by default", () => {
        const url = contentRequest("proj", "production", false);
        expect(url.pathname).toBe("/v2025-02-19/data/query/production");
        expect(url.searchParams.get("perspective")).toBeNull();
        expect(url.searchParams.get("query")).toContain("_type == \"project\"");
    });

    it("asks for drafts when the preview is open", () => {
        const url = contentRequest("proj", "production", true);
        expect(url.searchParams.get("perspective")).toBe("previewDrafts");
    });
});
