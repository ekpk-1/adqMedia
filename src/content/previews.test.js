import { describe, expect, it } from "vitest";
import { previewSrc } from "./previews";

const previews = {
    "/commercialGallery/DetailX/Tesla SATIN PPF.webm": "/previews/commercialGallery/DetailX/Tesla SATIN PPF.mp4",
};

describe("previewSrc", () => {
    it("swaps a film for its preview, URL-encoded", () => {
        const media = { id: "/commercialGallery/DetailX/Tesla SATIN PPF.webm", src: "/commercialGallery/DetailX/Tesla%20SATIN%20PPF.webm" };
        expect(previewSrc(media, previews)).toBe("/previews/commercialGallery/DetailX/Tesla%20SATIN%20PPF.mp4");
    });

    it("matches on an encoded src when the id is something else", () => {
        const media = { id: "film-1", src: "/commercialGallery/DetailX/Tesla%20SATIN%20PPF.webm" };
        expect(previewSrc(media, previews)).toBe("/previews/commercialGallery/DetailX/Tesla%20SATIN%20PPF.mp4");
    });

    it("keeps the full film when there is no preview", () => {
        const media = { id: "/gallery/videos/New.webm", src: "/gallery/videos/New.webm" };
        expect(previewSrc(media, previews)).toBe("/gallery/videos/New.webm");
    });
});
