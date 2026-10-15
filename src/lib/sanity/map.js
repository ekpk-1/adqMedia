import { assembleProject } from "@/content/assemble";

const FILM_WIDTH = 1080;
const FILM_HEIGHT = 1920;

const asNumber = (value) => (typeof value === "number" && Number.isFinite(value) ? value : null);

export function mapImage(source, alt) {
    const url = source?.url || source?.imageUrl;
    if (!url) return null;
    return {
        id: url,
        type: "image",
        src: url,
        width: asNumber(source.width) ?? asNumber(source.imageWidth) ?? 1600,
        height: asNumber(source.height) ?? asNumber(source.imageHeight) ?? 1000,
        duration: null,
        poster: null,
        alt: alt || source.alt || source.imageAlt || "",
    };
}

export function mapVideo(source, alt) {
    const src = typeof source?.src === "string" && source.src.startsWith("/") ? source.src : null;
    if (!src) return null;
    const width = asNumber(source.width) ?? FILM_WIDTH;
    const height = asNumber(source.height) ?? FILM_HEIGHT;
    const poster = typeof source.poster === "string" && source.poster.startsWith("/") ? source.poster : null;
    return {
        id: src,
        type: "video",
        src,
        width,
        height,
        duration: asNumber(source.duration),
        poster: poster
            ? {
                  src: poster,
                  width: asNumber(source.posterWidth) ?? width,
                  height: asNumber(source.posterHeight) ?? height,
              }
            : null,
        alt: alt || source.alt || "Film",
    };
}

function mapSlot(slot, title, photos) {
    const isVideo = slot?.kind === "video" || (typeof slot?.src === "string" && slot.src.startsWith("/") && !slot?.imageUrl);
    if (isVideo) return mapVideo(slot, slot?.alt || `${title}, film`);
    photos.count += 1;
    return mapImage(slot, slot?.alt || slot?.imageAlt || `${title}, photo ${photos.count}`);
}

export function mapProject(doc) {
    const photos = { count: 0 };
    const rows = (doc.rows ?? [])
        .map((row) => ({
            type: row.type,
            slots: (row.slots ?? []).map((slot) => mapSlot(slot, doc.title, photos)).filter(Boolean),
        }))
        .filter((row) => row.slots.length);

    const client = doc.client?.id ? doc.client : { id: "private", name: "Private owner" };
    return assembleProject({
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        client: { id: client.id, name: client.name },
        location: doc.location ?? null,
        date: doc.date ?? null,
        info: doc.info ?? null,
        credits: doc.credits ?? [],
        rows,
        cover: mapImage({ url: doc.cover?.url, width: doc.cover?.width, height: doc.cover?.height }, doc.coverAlt || `${doc.title}, cover`),
        coverVideo: mapVideo(doc.coverVideo, `${doc.title}, film`),
    });
}

export function mapClient(doc) {
    if (!doc?.id) return null;
    return {
        id: doc.id,
        name: doc.name,
        short: doc.short ?? null,
        wordmark: doc.wordmark ?? null,
        url: doc.url ?? null,
        logo: doc.logo ?? null,
    };
}

function mapShowreel(reel) {
    const video = mapVideo(reel, reel?.title || "Showreel");
    if (!video) return null;
    return {
        title: reel?.title ?? "",
        caption: reel?.caption ?? "",
        ...video,
    };
}

export function mapSettings(doc) {
    if (!doc) return null;
    return {
        email: doc.email,
        phone: doc.phone ?? null,
        location: doc.location,
        socials: doc.socials ?? [],
        showreel: mapShowreel(doc.showreel),
        info: {
            statement: doc.info?.statement ?? "",
            facts: doc.info?.facts ?? [],
            aboutLead: doc.info?.aboutLead ?? "",
            aboutBody: doc.info?.aboutBody ?? [],
            contactIntro: doc.info?.contactIntro ?? "",
            still: {
                caption: doc.info?.stillCaption ?? "",
                ...(mapImage(doc.info?.still, doc.info?.stillCaption) ?? {}),
            },
        },
        services: (doc.services ?? []).map((service) => ({
            ...service,
            image: mapImage(service.image, `${service.title}, example shot`),
        })),
    };
}

export function mapContent(result) {
    const projects = (result?.projects ?? []).map(mapProject).filter((project) => project.items.length && project.slug);
    const clients = (result?.clients ?? []).map(mapClient).filter((client) => client && client.id !== "private");
    return { projects, clients, settings: mapSettings(result?.settings) };
}
