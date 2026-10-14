// Content access for the site. Pages only talk to these functions, so moving
// to Sanity means rewriting this file and nothing else.
import manifest from "./media-manifest.json";
import { clients } from "./clients";
import { projectDocuments } from "./projects";
import { settings } from "./settings";
import { autoRows } from "@/lib/rows";
import { projectKind, summariseContents, toScrollOrder } from "@/lib/projects";

const POSTERS = {
    "/gallery/videos/Max-GT3RS.webm": "/posters/Max-GT3RS.jpg",
    "/gallery/videos/Rush_s-M3.webm": "/posters/Rush-s-M3.jpg",
    "/gallery/videos/Marc_s-EK.webm": "/posters/Marc-s-EK.jpg",
    "/gallery/videos/Jetts-GT3.webm": "/posters/Jetts-GT3.jpg",
    "/gallery/videos/TopSecret-GTR.webm": "/posters/TopSecret-GTR.jpg",
    "/gallery/videos/Tookies-Evo.webm": "/posters/Tookies-Evo.jpg",
    "/gallery/videos/Ferari360-Modena.webm": "/posters/Ferari360-Modena.jpg",
    "/commercialGallery/DetailX/Ferrari 296 GTB.webm": "/posters/Ferrari-296-GTB.jpg",
    "/commercialGallery/Dreamworks Auto/Dreamworks Red M4.webm": "/posters/Dreamworks-Red-M4.jpg",
    "/commercialGallery/KA Autosport/Mickey Rays 21A.webm": "/posters/Mickey-Rays-21A.jpg",
    "/commercialGallery/Vertex Detailing/Red Genesis.webm": "/posters/Red-Genesis.jpg",
    "/commercialGallery/TruTint/Copy of Trutint ADQ.webm": "/posters/Copy-of-Trutint-ADQ.jpg",
};

const clientsById = new Map(clients.map((client) => [client.id, client]));

function resolveMedia(path, alt) {
    const meta = manifest[path];
    if (!meta) {
        console.warn(`[content] Missing media, skipping slot: ${path}`);
        return null;
    }
    const poster = POSTERS[path];
    return {
        id: path,
        type: meta.kind,
        src: encodeURI(path),
        width: meta.width,
        height: meta.height,
        duration: meta.duration ?? null,
        poster: poster ? { src: poster, ...manifest[poster] } : null,
        alt,
    };
}

function folderMedia(folder) {
    const paths = Object.keys(manifest).filter(
        (path) =>
            path.startsWith(folder) &&
            !path.slice(folder.length).includes("/") &&
            !path.endsWith(".png")
    );
    const videos = paths.filter((path) => manifest[path].kind === "video");
    const photos = paths.filter((path) => manifest[path].kind === "image");
    // Lead with a film, then let the rest fall in shot order.
    return [...videos.slice(0, 1), ...photos, ...videos.slice(1)];
}

function altText(title, type, index) {
    return type === "video" ? `${title}, film` : `${title}, photo ${index}`;
}

function resolveRows(doc) {
    let photoCount = 0;
    const toMedia = (path) => {
        const isVideo = manifest[path]?.kind === "video";
        if (!isVideo) photoCount += 1;
        return resolveMedia(path, altText(doc.title, isVideo ? "video" : "image", photoCount));
    };

    if (doc.rows) {
        return doc.rows
            .map((row) => ({ ...row, slots: row.slots.map(toMedia).filter(Boolean) }))
            .filter((row) => row.slots.length);
    }
    const paths = doc.media ?? folderMedia(doc.folder);
    return autoRows(paths.map(toMedia).filter(Boolean));
}

function pickCover(doc, items) {
    if (doc.cover) {
        const cover = resolveMedia(doc.cover, `${doc.title}, cover`);
        if (cover) return cover;
    }
    const video = items.find((item) => item.type === "video");
    const firstWide = items.find((item) => item.type === "image" && item.width >= item.height);
    const firstImage = items.find((item) => item.type === "image");
    const fallback = firstWide ?? firstImage;
    if (fallback) return fallback;
    if (video?.poster) return { ...video.poster, type: "image", id: video.poster.src, alt: `${doc.title}, still` };
    return null;
}

function buildProject(doc) {
    const rows = resolveRows(doc);
    const items = toScrollOrder(rows);
    const coverVideo = items.find((item) => item.type === "video") ?? null;
    const client = clientsById.get(doc.client) ?? clientsById.get("private");

    return {
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        client: { id: client.id, name: client.name },
        location: doc.location ?? null,
        date: doc.date ?? null,
        info: doc.info ?? null,
        credits: doc.credits,
        rows,
        items,
        cover: pickCover(doc, items),
        coverVideo,
        kind: projectKind(items),
        contents: summariseContents(items),
        contentsLong: summariseContents(items, { withDuration: true }),
    };
}

const projects = projectDocuments.map(buildProject).filter((project) => project.items.length);

export function getProjects() {
    return projects;
}

export function getProject(slug) {
    return projects.find((project) => project.slug === slug) ?? null;
}

/** Light card data for the index, carousel and pager: no rows. */
export function getProjectSummaries() {
    return projects.map(({ slug, title, category, client, cover, coverVideo, kind }) => ({
        slug,
        title,
        category,
        clientName: client.id === "private" ? null : client.name,
        cover,
        coverVideo,
        kind,
    }));
}

export function getClients() {
    return clients.filter((client) => client.id !== "private");
}

export function getSiteSettings() {
    const reel = resolveMedia(settings.showreel.src, settings.showreel.title);
    const poster = manifest[settings.showreel.poster];
    return {
        ...settings,
        showreel: { ...settings.showreel, ...reel, poster: { src: settings.showreel.poster, ...poster } },
        info: {
            ...settings.info,
            still: { ...settings.info.still, ...resolveMedia(settings.info.still.src, settings.info.still.caption) },
        },
        services: settings.services.map((service) => ({
            ...service,
            image: resolveMedia(service.image, `${service.title}, example shot`),
        })),
    };
}
