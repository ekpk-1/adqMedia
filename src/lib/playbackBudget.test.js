import { describe, expect, it } from "vitest";
import { pickNearest, playbackLimit } from "./playbackBudget";

const viewport = { width: 1000, height: 800 };
const entry = (claim, top, left = 0, size = 200) => ({ claim, box: { top, left, width: size, height: size } });

describe("pickNearest", () => {
    it("allows the claims closest to the viewport centre", () => {
        const entries = [entry("top", -150, 400), entry("middle", 300, 400), entry("bottom", 700, 400)];
        expect(pickNearest(entries, viewport, 1)).toEqual(new Set(["middle"]));
        expect(pickNearest(entries, viewport, 2)).toEqual(new Set(["middle", "bottom"]));
    });

    it("allows everything when under the limit", () => {
        expect(pickNearest([entry("only", 0)], viewport, 2)).toEqual(new Set(["only"]));
    });
});

describe("playbackLimit", () => {
    it("plays one film on phones and two on larger screens", () => {
        expect(playbackLimit(true)).toBe(1);
        expect(playbackLimit(false)).toBe(2);
    });
});
