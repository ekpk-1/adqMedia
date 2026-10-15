import { describe, expect, it } from "vitest";
import { collectAssetPaths, planProject } from "./migrationPlan";

const manifest = {
    "/gallery/videos/Rush_s-M3.webm": { kind: "video", width: 1080, height: 1920, duration: 28 },
    "/gallery/rushsM3-1.jpg": { kind: "image", width: 2000, height: 1400 },
    "/gallery/rushsM3-2.jpg": { kind: "image", width: 2000, height: 1400 },
    "/commercialGallery/DetailX/a.webp": { kind: "image", width: 1600, height: 1000 },
    "/commercialGallery/DetailX/film.webm": { kind: "video", width: 1080, height: 1920, duration: 12 },
    "/commercialGallery/DetailX/notes.png": { kind: "image", width: 100, height: 100 },
    "/reel/showreel.mp4": { kind: "video", width: 1920, height: 1080, duration: 15 },
    "/posters/hero.jpg": { kind: "image", width: 1920, height: 1080 },
};

describe("planProject", () => {
    it("keeps a hand-built row and its cover film", () => {
        const plan = planProject(
            {
                slug: "rushs-m3",
                title: "Rush's M3",
                cover: "/gallery/rushsM3-1.jpg",
                rows: [{ type: "pair", slots: ["/gallery/videos/Rush_s-M3.webm", "/gallery/rushsM3-2.jpg"] }],
            },
            manifest
        );
        expect(plan.coverVideo).toBe("/gallery/videos/Rush_s-M3.webm");
        expect(plan.rows[0].type).toBe("pair");
        expect(plan.rows[0].slots.map((item) => item.kind)).toEqual(["video", "image"]);
    });

    it("reads a commercial folder and skips png sidecars", () => {
        const plan = planProject({ slug: "detailx", title: "DetailX", folder: "/commercialGallery/DetailX/" }, manifest);
        expect(plan.rows[0].slots.map((item) => item.path)).toEqual([
            "/commercialGallery/DetailX/film.webm",
            "/commercialGallery/DetailX/a.webp",
        ]);
    });
});

describe("collectAssetPaths", () => {
    it("lists each photo and film once, including the showreel", () => {
        const plans = [
            planProject(
                {
                    slug: "rushs-m3",
                    title: "Rush's M3",
                    cover: "/gallery/rushsM3-1.jpg",
                    rows: [{ type: "full", slots: ["/gallery/rushsM3-1.jpg"] }],
                },
                manifest
            ),
        ];
        const settings = {
            showreel: { src: "/reel/showreel.mp4", poster: "/posters/hero.jpg" },
            info: { still: { src: "/posters/hero.jpg" } },
            services: [],
        };
        const assets = collectAssetPaths(plans, settings, manifest);
        expect(assets.images).toEqual(["/gallery/rushsM3-1.jpg", "/posters/hero.jpg"]);
        expect(assets.videos).toEqual(["/reel/showreel.mp4"]);
    });
});
