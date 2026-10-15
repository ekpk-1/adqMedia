"use client";

import Link from "next/link";
import { useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { Photo } from "@/components/media/Photo";
import { useCanAutoplay } from "@/hooks/useMediaPreferences";
import { formatDuration } from "@/lib/projects";

/** Classes per tile shape. Mobile shapes are the base, desktop shapes use md:. */
const DESKTOP = {
    wide: { cell: "md:col-span-2", media: "md:aspect-[899/560] md:flex-1" },
    narrow: { cell: "md:col-span-1", media: "md:aspect-[437/560] md:flex-1" },
    third: { cell: "md:col-span-1", media: "md:aspect-[437/292] md:flex-1" },
};
const MOBILE = {
    lead: { cell: "col-span-2", media: "aspect-[4/5]" },
    full: { cell: "col-span-2", media: "aspect-[3/2]" },
    half: { cell: "col-span-1", media: "aspect-[3/4]" },
};

export function tileClasses(desktopShape, mobileShape) {
    const desktop = DESKTOP[desktopShape];
    const mobile = MOBILE[mobileShape];
    return { cell: `${mobile.cell} ${desktop.cell}`, media: `${mobile.media} ${desktop.media}` };
}

const SIZES = {
    wide: "(max-width: 767px) 100vw, (min-width: 1600px) 1000px, 63vw",
    narrow: "(max-width: 767px) 50vw, (min-width: 1600px) 480px, 31vw",
    third: "(max-width: 767px) 50vw, (min-width: 1600px) 480px, 31vw",
};

export function metaLabel(project) {
    const showClient = project.clientName && project.clientName !== project.title;
    const lead = showClient ? project.clientName : capitalise(project.category);
    return project.coverVideo?.duration ? `${lead} · ${formatDuration(project.coverVideo.duration)}` : lead;
}

function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function TileCaption({ number, title, meta, stacked, highlight }) {
    return (
        <div className={`flex items-baseline ${stacked ? "max-md:flex-col max-md:gap-1" : ""}`}>
            <span
                className={`label-plain w-8 shrink-0 transition-colors md:w-12 ${
                    highlight ? "text-accent-hover" : "text-text-muted"
                } ${stacked ? "max-md:hidden" : ""}`}
            >
                {number}
            </span>
            <span className="min-w-0 flex-1 text-[15px] font-medium leading-[18px] text-text md:text-body">
                {stacked ? <span className="mr-2 text-text md:hidden">{number}</span> : null}
                {title}
            </span>
            <span className="label text-[10px] leading-3 text-text-muted md:text-label md:leading-4">{meta}</span>
        </div>
    );
}

export function ProjectTile({ project, number, desktopShape, mobileShape }) {
    const [hover, setHover] = useState(false);
    const canAutoplay = useCanAutoplay();
    const classes = tileClasses(desktopShape, mobileShape);
    const showVideo = canAutoplay && project.coverVideo;
    const cover = <Photo media={project.cover} sizes={SIZES[desktopShape]} />;

    return (
        <Link
            href={`/work/${project.slug}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            className={`${classes.cell} group flex flex-col gap-2.5 outline-none md:gap-[14px]`}
        >
            <div className={`${classes.media} relative w-full overflow-hidden bg-surface`}>
                <div className="absolute inset-0">
                    {showVideo ? <AutoVideo media={project.coverVideo} preview fallback={project.cover ? cover : null} /> : cover}
                </div>
                <div
                    aria-hidden
                    className={`absolute inset-0 bg-overlay transition-opacity duration-300 ${hover ? "opacity-100" : "opacity-0"}`}
                />
                <div
                    aria-hidden
                    className={`viewfinder absolute inset-5 [--vf-size:28px] [--vf-inset:0px] ${hover ? "vf-on" : ""}`}
                />
                <span
                    aria-hidden
                    className={`label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-5 py-2.5 text-text transition-opacity duration-300 max-md:hidden ${
                        hover ? "opacity-100" : "opacity-0"
                    }`}
                >
                    View project →
                </span>
            </div>
            <TileCaption
                number={number}
                title={project.title}
                meta={metaLabel(project)}
                stacked={mobileShape === "half"}
                highlight={hover}
            />
        </Link>
    );
}
