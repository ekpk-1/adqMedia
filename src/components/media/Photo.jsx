import Image from "next/image";

function remoteLoader(src, width, quality, widthParam) {
    const url = new URL(src);
    url.searchParams.set(widthParam, String(width));
    url.searchParams.set("q", String(quality ?? 75));
    if (widthParam === "w") url.searchParams.set("auto", "format");
    return url.toString();
}

const sanityLoader = ({ src, width, quality }) => {
    const url = new URL(remoteLoader(src, width, quality, "w"));
    url.searchParams.set("fit", "max");
    return url.toString();
};
function loaderFor(src) {
    if (src.includes("cdn.sanity.io")) return sanityLoader;
    return undefined;
}

/**
 * A photo that fills its box. Pass `contain` to letterbox instead of crop.
 * `sizes` should describe the rendered width so the right rendition loads.
 */
export function Photo({ media, sizes, contain = false, priority = false, className = "" }) {
    if (!media) return null;
    return (
        <Image
            src={media.src}
            loader={loaderFor(media.src)}
            alt={media.alt ?? ""}
            width={media.width}
            height={media.height}
            sizes={sizes}
            priority={priority}
            quality={75}
            draggable={false}
            className={`size-full ${contain ? "object-contain" : "object-cover"} ${className}`}
        />
    );
}
