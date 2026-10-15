import { describe, expect, it } from "vitest";
import { resolveProjectView } from "./theme";

describe("resolveProjectView", () => {
    it("defaults to layout on desktop and scroll on mobile", () => {
        expect(resolveProjectView(null, false)).toBe("layout");
        expect(resolveProjectView(null, true)).toBe("scroll");
    });

    it("remembers the visitor's choice", () => {
        expect(resolveProjectView("scroll", false)).toBe("scroll");
        expect(resolveProjectView("layout", true)).toBe("layout");
    });
});
