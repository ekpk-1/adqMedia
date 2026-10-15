import { projectKind, summariseContents, toScrollOrder } from "@/lib/projects";

function defaultCover(title, items) {
    const video = items.find((item) => item.type === "video");
    const firstWide = items.find((item) => item.type === "image" && item.width >= item.height);
    const firstImage = items.find((item) => item.type === "image");
    const fallback = firstWide ?? firstImage;
    if (fallback) return fallback;
    if (video?.poster) return { ...video.poster, type: "image", id: video.poster.src, alt: `${title}, still` };
    return null;
}

/** The project shape the pages already render. Rows are resolved media, not file paths. */
export function assembleProject(doc) {
    const rows = (doc.rows ?? []).filter((row) => row.slots?.length);
    const items = toScrollOrder(rows);
    const coverVideo = doc.coverVideo ?? items.find((item) => item.type === "video") ?? null;

    return {
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        client: doc.client,
        location: doc.location ?? null,
        date: doc.date ?? null,
        info: doc.info ?? null,
        credits: doc.credits ?? [],
        rows,
        items,
        cover: doc.cover ?? defaultCover(doc.title, items),
        coverVideo,
        kind: projectKind(items),
        contents: summariseContents(items),
        contentsLong: summariseContents(items, { withDuration: true }),
    };
}

export function summariseProject(project) {
    return {
        slug: project.slug,
        title: project.title,
        category: project.category,
        clientName: project.client?.id === "private" ? null : (project.client?.name ?? null),
        cover: project.cover,
        coverVideo: project.coverVideo,
        kind: project.kind,
    };
}
