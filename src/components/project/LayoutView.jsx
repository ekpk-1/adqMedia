"use client";

import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { PlusIcon } from "@/components/chrome/SiteHeader";
import { VideoSlot } from "./VideoSlot";

const aspect = (media) => media.width / media.height;

function rowSizes(row) {
    const total = row.slots.reduce((sum, media) => sum + aspect(media), 0);
    return (media) => `(max-width: 767px) 100vw, ${Math.round((aspect(media) / total) * 94)}vw`;
}

function Slot({ media, sizes, priority }) {
    const isVideo = media.type === "video";
    return (
        <div
            className={`relative overflow-hidden bg-surface ${isVideo ? "max-md:basis-full" : ""}`}
            style={{ flex: `${aspect(media)} 1 0%`, aspectRatio: `${media.width} / ${media.height}` }}
        >
            {isVideo ? <VideoSlot media={media} /> : <Photo media={media} sizes={sizes} priority={priority} />}
        </div>
    );
}

function TextRow({ row, project, onOpenInfo }) {
    const media = row.slots[0];
    return (
        <div className="flex gap-4 max-md:flex-col-reverse">
            <div className="flex flex-1 flex-col justify-end gap-6 pb-2 md:pb-10 md:pr-24">
                <span className="label leading-[14px] text-text-muted">About the shoot</span>
                <p className="text-[22px] leading-[30px] text-text md:text-[28px] md:leading-[38px]">{project.info?.lead}</p>
                <button type="button" onClick={onOpenInfo} className="chrome-link label flex items-center gap-2 self-start text-text">
                    Full info <PlusIcon />
                </button>
            </div>
            <div className="relative flex-1 overflow-hidden bg-surface" style={{ aspectRatio: `${media.width} / ${media.height}` }}>
                <Photo media={media} sizes="(max-width: 767px) 100vw, 47vw" />
            </div>
        </div>
    );
}

export function ProjectTitleBlock({ project }) {
    const meta = [
        { label: "Category", value: project.category === "creative" ? "Creative" : "Commercial" },
        { label: "Contents", value: project.contents },
        project.location ? { label: "Location", value: project.location } : null,
    ].filter(Boolean);

    return (
        <div className="flex flex-col gap-8 px-5 pb-8 pt-24 md:flex-row md:items-end md:justify-between md:px-10 md:pb-10 md:pt-[192px]">
            <div className="flex min-w-0 flex-col gap-3 md:gap-5">
                <span className="label leading-[14px] text-text-muted">{project.kind}</span>
                <h1 className="font-display text-[clamp(72px,12.8vw,184px)] uppercase leading-[0.87] text-text">{project.title}</h1>
            </div>
            <dl className="flex shrink-0 gap-8 md:gap-12 md:pb-3">
                {meta.map((item) => (
                    <div key={item.label} className="flex flex-col gap-2">
                        <dt className="label leading-[14px] text-text-muted">{item.label}</dt>
                        <dd className="text-[15px] leading-5 text-text md:text-body">{item.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export function LayoutView({ project, neighbours, onOpenInfo, footer }) {
    let firstPhotoSeen = false;
    return (
        <div data-project-layout>
            <ProjectTitleBlock project={project} />
            <div className="flex flex-col gap-4 px-5 md:px-10">
                {project.rows.map((row, index) => {
                    if (row.type === "text") {
                        return project.info?.lead ? (
                            <TextRow key={index} row={row} project={project} onOpenInfo={onOpenInfo} />
                        ) : (
                            <MediaRow key={index} row={row} />
                        );
                    }
                    const priority = !firstPhotoSeen && index < 2;
                    if (row.slots.some((media) => media.type === "image")) firstPhotoSeen = true;
                    return <MediaRow key={index} row={row} priority={priority} />;
                })}
            </div>
            <ProjectPager neighbours={neighbours} />
            {footer}
        </div>
    );
}

function MediaRow({ row, priority = false }) {
    const sizes = rowSizes(row);
    return (
        <div className={`flex gap-4 max-md:flex-wrap ${row.slots.length === 1 && row.type !== "full" ? "md:w-1/2" : ""}`}>
            {row.slots.map((media) => (
                <Slot key={media.id} media={media} sizes={sizes(media)} priority={priority} />
            ))}
        </div>
    );
}

export function ProjectPager({ neighbours }) {
    const { previous, next } = neighbours;
    if (!next) return null;
    return (
        <nav aria-label="More projects" className="flex flex-col gap-10 px-5 pb-10 pt-20 md:px-10 md:pt-[120px]">
            <div className="flex justify-between gap-4 border-b border-line pb-5">
                <Link href={`/work/${previous.slug}`} className="chrome-link label leading-[14px] text-text-muted hover:text-text">
                    ← <span className="max-md:hidden">Previous · {previous.title}</span>
                    <span className="md:hidden">Previous</span>
                </Link>
                <Link href="/" className="chrome-link label leading-[14px] text-text-muted hover:text-text">
                    Back to all work
                </Link>
                <Link href={`/work/${next.slug}`} className="chrome-link label leading-[14px] text-text">
                    Next project →
                </Link>
            </div>
            <Link href={`/work/${next.slug}`} className="group flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
                <div className="flex min-w-0 flex-col gap-3 md:gap-5">
                    <span className="label leading-[14px] text-text-muted">
                        Up next · {next.category === "creative" ? "Creative" : "Commercial"}
                    </span>
                    <span className="font-display text-[clamp(64px,12.8vw,184px)] uppercase leading-[0.87] text-text transition-colors group-hover:text-accent-hover">
                        {next.title}
                    </span>
                </div>
                {next.cover ? (
                    <div className="viewfinder vf-group relative aspect-[443/295] w-full shrink-0 [--vf-inset:12px] [--vf-size:20px] md:w-[min(443px,31vw)]">
                        <div className="absolute inset-0 overflow-hidden bg-surface">
                            <Photo media={next.cover} sizes="(max-width: 767px) 100vw, 31vw" />
                        </div>
                    </div>
                ) : null}
            </Link>
        </nav>
    );
}
