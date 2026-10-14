export const FILTERS = ["creative", "all", "commercial"];

export function parseFilter(value) {
    return value === "creative" || value === "commercial" ? value : "all";
}

export function filterProjects(projects, filter) {
    const active = parseFilter(filter);
    if (active === "all") return projects;
    return projects.filter((project) => project.category === active);
}

/** Previous and next follow the manual order across all projects and wrap at the ends. */
export function getNeighbours(projects, slug) {
    const index = projects.findIndex((project) => project.slug === slug);
    if (index === -1 || projects.length < 2) return { previous: null, next: null };
    const count = projects.length;
    return {
        previous: projects[(index - 1 + count) % count],
        next: projects[(index + 1) % count],
    };
}

/** Walks rows in order and slots left to right, skipping empty slots. */
export function toScrollOrder(rows) {
    return rows.flatMap((row) => row.slots.filter(Boolean));
}

export function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const whole = Math.floor(seconds);
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function plural(count, word) {
    return `${count} ${word}${count === 1 ? "" : "s"}`;
}

/** "1 film · 7 photos" */
export function summariseContents(items, { withDuration = false } = {}) {
    const films = items.filter((item) => item.type === "video");
    const photos = items.filter((item) => item.type === "image");
    const parts = [];
    if (films.length) {
        let label = plural(films.length, "film");
        if (withDuration && films.length === 1 && films[0].duration) {
            label += ` (${formatDuration(films[0].duration)})`;
        }
        parts.push(label);
    }
    if (photos.length) parts.push(plural(photos.length, "photo"));
    return parts.join(" · ");
}

export function projectKind(items) {
    const hasFilm = items.some((item) => item.type === "video");
    const hasPhoto = items.some((item) => item.type === "image");
    if (hasFilm && hasPhoto) return "Photo + film";
    return hasFilm ? "Film" : "Photo";
}
