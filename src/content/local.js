// File-backed content. The site uses this until Sanity has at least one published project.
import manifest from "./media-manifest.json";
import { clients } from "./clients";
import { projectDocuments } from "./projects";
import { settings } from "./settings";
import { assembleProject, summariseProject } from "./assemble";
import { POSTERS } from "./posters";
import { autoRows } from "@/lib/rows";

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
        (path) => path.startsWith(folder) && !path.slice(folder.length).includes("/") && !path.endsWith(".png")
    );
    const videos = paths.filter((path) => manifest[path].kind === "video");
    const photos = paths.filter((path) => manifest[path].kind === "image");
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

function buildProject(doc) {
    const client = clientsById.get(doc.client) ?? clientsById.get("private");
    const cover = doc.cover ? resolveMedia(doc.cover, `${doc.title}, cover`) : null;
    return assembleProject({
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        client: { id: client.id, name: client.name },
        location: doc.location ?? null,
        date: doc.date ?? null,
        info: doc.info ?? null,
        credits: doc.credits,
        rows: resolveRows(doc),
        cover,
    });
}

const projects = projectDocuments.map(buildProject).filter((project) => project.items.length);

export function getProjects() {
    return projects;
}

export function getProject(slug) {
    return projects.find((project) => project.slug === slug) ?? null;
}

export function getProjectSummaries() {
    return projects.map(summariseProject);
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
