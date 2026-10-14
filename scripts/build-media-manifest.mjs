// Records dimensions and durations for everything under public/ so the local
// content repository can size slots without loading media. Sanity and Mux
// return the same metadata, so this script goes away after the migration.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { imageSize } from "image-size";
import { parseFile } from "music-metadata";

const PUBLIC_DIR = path.resolve("public");
const OUT_FILE = path.resolve("src/content/media-manifest.json");
const ROOTS = ["gallery", "commercialGallery", "reel", "posters"];
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXT = new Set([".webm", ".mp4"]);
const DEFAULT_VIDEO = { width: 1080, height: 1920 };

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(
        entries.map((entry) => {
            const full = path.join(dir, entry.name);
            return entry.isDirectory() ? walk(full) : [full];
        })
    );
    return nested.flat();
}

function toUrl(file) {
    return "/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
}

async function describeImage(file) {
    const { width, height } = imageSize(await readFile(file));
    return { kind: "image", width, height };
}

async function describeVideo(file) {
    const { format } = await parseFile(file, { duration: true });
    const video = format.trackInfo?.find((track) => track.video)?.video;
    return {
        kind: "video",
        width: video?.pixelWidth ?? DEFAULT_VIDEO.width,
        height: video?.pixelHeight ?? DEFAULT_VIDEO.height,
        duration: format.duration ? Math.round(format.duration * 10) / 10 : null,
    };
}

async function main() {
    const manifest = {};
    for (const root of ROOTS) {
        const files = await walk(path.join(PUBLIC_DIR, root));
        for (const file of files.sort()) {
            const ext = path.extname(file).toLowerCase();
            try {
                if (IMAGE_EXT.has(ext)) manifest[toUrl(file)] = await describeImage(file);
                else if (VIDEO_EXT.has(ext)) manifest[toUrl(file)] = await describeVideo(file);
            } catch (error) {
                console.warn(`Skipped ${toUrl(file)}: ${error.message}`);
            }
        }
    }
    await writeFile(OUT_FILE, JSON.stringify(manifest, null, 2) + "\n");
    const missing = Object.entries(manifest).filter(([, m]) => m.kind === "video" && !m.duration);
    console.log(`Wrote ${Object.keys(manifest).length} entries to ${path.relative(".", OUT_FILE)}`);
    if (missing.length) console.log("Videos without a duration:", missing.map(([url]) => url));
}

main();
