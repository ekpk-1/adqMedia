import Image from "next/image";

/**
 * A photo that fills its box. Pass `contain` to letterbox instead of crop.
 * `sizes` should describe the rendered width so the right rendition loads.
 */
export function Photo({ media, sizes, contain = false, priority = false, className = "" }) {
    if (!media) return null;
    return (
        <Image
            src={media.src}
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
