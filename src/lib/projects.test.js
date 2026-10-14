import { describe, expect, it } from "vitest";
import {
    filterProjects,
    formatDuration,
    getNeighbours,
    parseFilter,
    summariseContents,
    toScrollOrder,
} from "./projects";

const projects = [
    { slug: "a", category: "creative" },
    { slug: "b", category: "commercial" },
    { slug: "c", category: "creative" },
];

describe("filterProjects", () => {
    it("keeps everything for all", () => {
        expect(filterProjects(projects, "all")).toHaveLength(3);
    });

    it("filters by category", () => {
        expect(filterProjects(projects, "creative").map((p) => p.slug)).toEqual(["a", "c"]);
        expect(filterProjects(projects, "commercial").map((p) => p.slug)).toEqual(["b"]);
    });

    it("treats unknown values as all", () => {
        expect(parseFilter("photos")).toBe("all");
        expect(parseFilter(null)).toBe("all");
        expect(filterProjects(projects, "nope")).toHaveLength(3);
    });
});

describe("getNeighbours", () => {
    it("steps through the full list", () => {
        const { previous, next } = getNeighbours(projects, "b");
        expect(previous.slug).toBe("a");
        expect(next.slug).toBe("c");
    });

    it("wraps at both ends", () => {
        expect(getNeighbours(projects, "a").previous.slug).toBe("c");
        expect(getNeighbours(projects, "c").next.slug).toBe("a");
    });

    it("returns nothing for an unknown slug or a single project", () => {
        expect(getNeighbours(projects, "zzz")).toEqual({ previous: null, next: null });
        expect(getNeighbours([projects[0]], "a")).toEqual({ previous: null, next: null });
    });
});

describe("toScrollOrder", () => {
    it("walks rows in order and slots left to right", () => {
        const rows = [
            { type: "trio", slots: [{ id: 1 }, { id: 2 }, { id: 3 }] },
            { type: "full", slots: [{ id: 4 }] },
            { type: "pair", slots: [{ id: 5 }, null] },
        ];
        expect(toScrollOrder(rows).map((item) => item.id)).toEqual([1, 2, 3, 4, 5]);
    });
});

describe("formatting", () => {
    it("formats durations as m:ss", () => {
        expect(formatDuration(28.5)).toBe("0:28");
        expect(formatDuration(72)).toBe("1:12");
        expect(formatDuration(NaN)).toBe("0:00");
    });

    it("summarises contents", () => {
        const items = [{ type: "video", duration: 28.5 }, ...Array(7).fill({ type: "image" })];
        expect(summariseContents(items)).toBe("1 film · 7 photos");
        expect(summariseContents(items, { withDuration: true })).toBe("1 film (0:28) · 7 photos");
        expect(summariseContents([{ type: "image" }])).toBe("1 photo");
    });
});
