import { describe, expect, it } from "vitest";
import { resolveProjectView, resolveTheme } from "./theme";

describe("resolveTheme", () => {
    it("uses the stored choice first", () => {
        expect(resolveTheme("light", true)).toBe("light");
        expect(resolveTheme("dark", false)).toBe("dark");
    });

    it("falls back to the system setting", () => {
        expect(resolveTheme(null, true)).toBe("dark");
        expect(resolveTheme(null, false)).toBe("light");
        expect(resolveTheme("system", false)).toBe("light");
        expect(resolveTheme("garbage", true)).toBe("dark");
    });
});

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
