// Small silent copies of films for autoplaying tiles, written by
// `npm run media:previews`. Films without one fall back to the full file.
import generated from "./video-previews.json";

function decode(path) {
    try {
        return decodeURI(path);
    } catch {
        return path;
    }
}

export function previewSrc(media, previews = generated) {
    const preview = previews[decode(media.id ?? media.src)] ?? previews[decode(media.src)];
    return preview ? encodeURI(preview) : media.src;
}
