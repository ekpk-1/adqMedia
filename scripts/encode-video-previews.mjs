// Encodes a small, silent H.264 copy of every gallery film for autoplaying
// tiles, and records which films have one in src/content/video-previews.json.
// Full films stay untouched for project pages and the player. Needs ffmpeg on
// PATH (or FFMPEG_PATH). Re-run after adding films; unchanged films are skipped.
import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const PUBLIC_DIR = path.resolve("public");
const OUT_DIR = path.join(PUBLIC_DIR, "previews");
const MAP_FILE = path.resolve("src/content/video-previews.json");
const MANIFEST_FILE = path.resolve("src/content/media-manifest.json");
const ROOTS = ["gallery", "commercialGallery"];
const VIDEO_EXT = new Set([".webm", ".mp4"]);
// Tiles crop portrait films to landscape, so a wide tile scales the film by its
// width. Going below 1080 would upscale it on large screens.
const MAX_SHORT_SIDE = 1080;

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

const toUrl = (file) => "/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/");

async function isFresh(source, output) {
    try {
        const [src, out] = await Promise.all([stat(source), stat(output)]);
        return out.mtimeMs >= src.mtimeMs;
    } catch {
        return false;
    }
}

function scaleArgs(meta) {
    if (!meta || Math.min(meta.width, meta.height) <= MAX_SHORT_SIDE) return [];
    return ["-vf", meta.width > meta.height ? `scale=-2:${MAX_SHORT_SIDE}` : `scale=${MAX_SHORT_SIDE}:-2`];
}

function encode(source, output, meta) {
    const args = [
        "-hide_banner", "-loglevel", "error", "-y",
        "-i", source,
        "-map", "0:v:0", "-an",
        ...scaleArgs(meta),
        "-c:v", "libx264", "-preset", "slow", "-crf", "25",
        "-maxrate", "3M", "-bufsize", "6M",
        "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        output,
    ];
    return new Promise((resolve, reject) => {
        const child = spawn(FFMPEG, args, { stdio: ["ignore", "inherit", "inherit"] });
        child.on("error", reject);
        child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))));
    });
}

async function main() {
    const manifest = JSON.parse(await readFile(MANIFEST_FILE, "utf8"));
    const previews = {};
    for (const root of ROOTS) {
        const files = (await walk(path.join(PUBLIC_DIR, root))).filter((file) => VIDEO_EXT.has(path.extname(file).toLowerCase()));
        for (const source of files.sort()) {
            const url = toUrl(source);
            const relative = path.relative(PUBLIC_DIR, source).replace(/\.[^.]+$/, ".mp4");
            const output = path.join(OUT_DIR, relative);
            if (!(await isFresh(source, output))) {
                await mkdir(path.dirname(output), { recursive: true });
                console.log(`Encoding ${url}`);
                const partial = `${output}.part.mp4`;
                try {
                    await encode(source, partial, manifest[url]);
                    await rename(partial, output);
                } catch (error) {
                    await rm(partial, { force: true });
                    console.warn(`Skipped ${url}: ${error.message}`);
                    continue;
                }
            }
            previews[url] = toUrl(output);
        }
    }
    await writeFile(MAP_FILE, JSON.stringify(previews, null, 2) + "\n");
    console.log(`Wrote ${Object.keys(previews).length} previews to ${path.relative(".", MAP_FILE)}`);
}

main();
