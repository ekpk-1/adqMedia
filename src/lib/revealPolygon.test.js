import { describe, expect, it } from "vitest";
import { revealPolygon } from "./revealPolygon";

const points = (polygon) =>
    polygon
        .slice("polygon(".length, -1)
        .split(", ")
        .map((pair) => pair.split(" ").map((value) => parseFloat(value)));

describe("revealPolygon", () => {
    it("draws a fully revealed row as its whole band", () => {
        const shape = points(revealPolygon([{ start: 0, end: 0 }, { start: 0, end: 100 }, { start: 0, end: 0 }]));
        expect(shape).toContainEqual([100, 33.333]);
        expect(shape).toContainEqual([100, 66.667]);
    });

    it("keeps hidden rows at zero width", () => {
        const shape = points(revealPolygon([{ start: 0, end: 0 }, { start: 0, end: 0 }]));
        expect(shape.every(([x]) => x === 0)).toBe(true);
    });

    it("lets a band start part way across while it wipes out", () => {
        const shape = points(revealPolygon([{ start: 40, end: 100 }]));
        expect(shape).toContainEqual([40, 0]);
        expect(shape).toContainEqual([100, 100]);
    });

    it("returns an empty shape with no rows", () => {
        expect(revealPolygon([])).toBe("polygon(0 0, 0 0, 0 0)");
    });
});
