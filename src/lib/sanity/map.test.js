import { describe, expect, it } from "vitest";
import { mapContent, mapVideo } from "./map";

const film = "/gallery/videos/Rush_s-M3.webm";

describe("mapVideo", () => {
    it("points a film at a file in the gallery", () => {
        const video = mapVideo(
            { src: film, poster: "/posters/Rush-s-M3.jpg", duration: 28.4, width: 1080, height: 1920 },
            "Rush's M3, film"
        );
        expect(video).toMatchObject({
            id: film,
            type: "video",
            src: film,
            width: 1080,
            height: 1920,
            duration: 28.4,
            poster: { src: "/posters/Rush-s-M3.jpg", width: 1080, height: 1920 },
            alt: "Rush's M3, film",
        });
    });

    it("skips a film that is not a path on this site", () => {
        expect(mapVideo({ src: "https://stream.mux.com/abc.m3u8" }, "Film")).toBeNull();
        expect(mapVideo({ src: null }, "Film")).toBeNull();
    });
});

describe("mapContent", () => {
    it("builds a project the pages can render", () => {
        const content = mapContent({
            projects: [
                {
                    title: "Rush's M3",
                    slug: "rushs-m3",
                    category: "creative",
                    location: "Melbourne",
                    client: { id: "private", name: "Private owner" },
                    info: { lead: "By the water.", body: "Seven stills." },
                    credits: [{ role: "Photo + film", name: "Alex Quach" }],
                    cover: { url: "https://cdn.sanity.io/images/p/d/cover.jpg", width: 2000, height: 1400 },
                    coverVideo: { src: film, poster: "/posters/Rush-s-M3.jpg", width: 1080, height: 1920, duration: 28 },
                    rows: [
                        {
                            type: "pair",
                            slots: [
                                { kind: "video", src: film, poster: "/posters/Rush-s-M3.jpg", duration: 28, width: 1080, height: 1920, alt: "Rush's M3, film" },
                                { kind: "image", imageUrl: "https://cdn.sanity.io/images/p/d/still.jpg", imageWidth: 1600, imageHeight: 1000 },
                            ],
                        },
                    ],
                },
            ],
            clients: [
                { id: "private", name: "Private owner" },
                { id: "detailx", name: "DetailX", wordmark: "satoshi" },
            ],
            settings: {
                email: "hello@adqmedia.com.au",
                location: "Melbourne, AU",
                socials: [{ label: "Instagram", url: "https://www.instagram.com/adq.media" }],
                showreel: { title: "Showreel 2025", caption: "Melbourne", src: "/reel/showreel.mp4", poster: "/posters/hero-15s.jpg", duration: 15, width: 1080, height: 1920 },
                info: {
                    statement: "Melbourne car photography.",
                    facts: [{ value: "2024", label: "Shooting freelance since" }],
                    aboutLead: "Alex Quach.",
                    aboutBody: ["Dealerships.", "Meets."],
                    contactIntro: "Tell Alex about the car.",
                    stillCaption: "Showreel still",
                    still: { url: "https://cdn.sanity.io/images/p/d/hero.jpg", width: 1920, height: 1080 },
                },
                services: [],
            },
        });

        expect(content.clients.map((client) => client.id)).toEqual(["detailx"]);
        expect(content.projects).toHaveLength(1);
        const project = content.projects[0];
        expect(project.slug).toBe("rushs-m3");
        expect(project.kind).toBe("Photo + film");
        expect(project.contents).toBe("1 film · 1 photo");
        expect(project.cover.src).toContain("cover.jpg");
        expect(project.coverVideo.src).toBe(film);
        expect(project.items).toHaveLength(2);
        expect(content.settings.email).toBe("hello@adqmedia.com.au");
        expect(content.settings.showreel.src).toBe("/reel/showreel.mp4");
        expect(content.settings.showreel.poster.src).toBe("/posters/hero-15s.jpg");
        expect(content.settings.info.still.src).toContain("hero.jpg");
        expect(content.settings.info.still.caption).toBe("Showreel still");
    });
});
