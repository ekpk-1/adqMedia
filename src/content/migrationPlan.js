/** Which files a project and the site settings refer to. Photos are uploaded. Films stay in public/. No network, no Next aliases. */

export function folderMedia(folder, manifest) {
    const paths = Object.keys(manifest).filter(
        (file) => file.startsWith(folder) && !file.slice(folder.length).includes("/") && !file.endsWith(".png")
    );
    const videos = paths.filter((file) => manifest[file].kind === "video");
    const photos = paths.filter((file) => manifest[file].kind === "image");
    return [...videos.slice(0, 1), ...photos, ...videos.slice(1)];
}

function slot(path, manifest, alt) {
    const meta = manifest[path];
    if (!meta) return null;
    return { kind: meta.kind === "video" ? "video" : "image", path, alt, width: meta.width, height: meta.height, duration: meta.duration ?? null };
}

export function planProject(doc, manifest) {
    let photoCount = 0;
    const toSlot = (file) => {
        const meta = manifest[file];
        const isVideo = meta?.kind === "video";
        if (!isVideo) photoCount += 1;
        const alt = isVideo ? `${doc.title}, film` : `${doc.title}, photo ${photoCount}`;
        return slot(file, manifest, alt);
    };

    const sourceRows = doc.rows
        ? doc.rows.map((row) => ({ type: row.type, slots: row.slots.map(toSlot).filter(Boolean) }))
        : [{ type: "auto", slots: (doc.media ?? folderMedia(doc.folder, manifest)).map(toSlot).filter(Boolean) }];

    const rows = sourceRows.filter((row) => row.slots.length);
    const films = rows.flatMap((row) => row.slots).filter((item) => item.kind === "video");
    return {
        slug: doc.slug,
        title: doc.title,
        rows,
        cover: doc.cover && manifest[doc.cover] ? doc.cover : null,
        coverVideo: films[0]?.path ?? null,
    };
}

export function collectAssetPaths(plans, settings, manifest) {
    const images = new Set();
    const videos = new Set();
    const add = (file) => {
        const meta = manifest[file];
        if (!meta) return;
        (meta.kind === "video" ? videos : images).add(file);
    };

    for (const plan of plans) {
        if (plan.cover) add(plan.cover);
        if (plan.coverVideo) add(plan.coverVideo);
        for (const row of plan.rows) {
            for (const item of row.slots) add(item.path);
        }
    }

    add(settings.showreel.src);
    add(settings.showreel.poster);
    add(settings.info.still.src);
    for (const service of settings.services) add(service.image);
    return { images: [...images], videos: [...videos] };
}
