"use client";

import { useEffect, useRef, useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { Photo } from "@/components/media/Photo";
import { PlusIcon } from "@/components/chrome/SiteHeader";
import { useCanAutoplay } from "@/hooks/useMediaPreferences";
import { useVideoClock } from "@/hooks/useVideoClock";
import { formatDuration } from "@/lib/projects";
import { ProgressLine, useVideoControls } from "./VideoSlot";

const pad = (n) => String(n).padStart(2, "0");

/** Each item fills the screen and snaps to the next. */
export function ScrollView({ project, onOpenInfo }) {
    const containerRef = useRef(null);
    const slideRefs = useRef([]);
    const [active, setActive] = useState(0);
    const items = project.items;

    useEffect(() => {
        const container = containerRef.current;
        container?.focus({ preventScroll: true });
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
                }
            },
            { root: container, threshold: 0.6 }
        );
        slideRefs.current.forEach((slide) => slide && observer.observe(slide));
        return () => observer.disconnect();
    }, [items]);

    const goTo = (index) => {
        slideRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div
            ref={containerRef}
            tabIndex={-1}
            aria-label={`${project.title}, ${items.length} items`}
            className="fixed inset-0 snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none [scrollbar-width:none]"
        >
            {items.map((media, index) => (
                <section
                    key={media.id}
                    ref={(node) => {
                        slideRefs.current[index] = node;
                    }}
                    data-index={index}
                    aria-label={`${pad(index + 1)} of ${pad(items.length)}`}
                    className="relative h-svh snap-start snap-always"
                >
                    <ScrollSlide
                        media={media}
                        index={index}
                        total={items.length}
                        project={project}
                        isActive={active === index}
                        next={items[index + 1]}
                        onNext={() => goTo(index + 1)}
                        onOpenInfo={onOpenInfo}
                    />
                </section>
            ))}
            <Filmstrip items={items} active={active} onPick={goTo} />
            <Pips count={items.length} active={active} onPick={goTo} />
        </div>
    );
}

function frameStyle(media) {
    const ratio = media.width / media.height;
    const tall = ratio < 1;
    // Desktop bounds: below the top bar, clear of the caption and filmstrip.
    const bottom = tall ? 32 : 180;
    const sideGutter = tall ? 120 : 96;
    return {
        "--frame-w": `min(calc(100vw - ${sideGutter * 2}px), calc((100svh - ${100 + bottom}px) * ${ratio}))`,
        "--frame-ar": `${media.width} / ${media.height}`,
    };
}

function ScrollSlide({ media, index, total, project, isActive, next, onNext, onOpenInfo }) {
    const isVideo = media.type === "video";
    const videoRef = useRef(null);
    const canAutoplay = useCanAutoplay();
    const controls = useVideoControls(videoRef);
    const clock = useVideoClock(videoRef, media.duration);
    const ratio = clock.duration ? clock.current / clock.duration : 0;
    const counter = `${pad(index + 1)} / ${pad(total)}`;
    const filmLabel = isVideo ? ` · Film · ${formatDuration(clock.current)} / ${formatDuration(clock.duration)}` : "";

    const mediaNode = isVideo ? (
        <AutoVideo
            ref={videoRef}
            media={media}
            active={isActive && canAutoplay && !controls.paused}
            muted={controls.muted}
            threshold={0.6}
        />
    ) : (
        <Photo media={media} sizes="(max-width: 767px) 100vw, 80vw" priority={index === 0} />
    );

    return (
        <>
            <div
                className="tone-dark absolute overflow-hidden bg-background max-md:inset-0 md:left-1/2 md:top-[100px] md:aspect-(--frame-ar) md:w-(--frame-w) md:-translate-x-1/2"
                style={frameStyle(media)}
            >
                {mediaNode}
                {isVideo ? <ProgressLine ratio={ratio} className="absolute inset-x-0 bottom-0 h-[3px] max-md:hidden" /> : null}
            </div>

            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-[#0f0f0f99] to-transparent md:hidden" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[260px] bg-gradient-to-b from-transparent to-[#0f0f0fd9] md:hidden" />

            <div className="tone-dark-mobile absolute inset-x-5 bottom-[30px] flex flex-col gap-3 md:inset-x-auto md:bottom-10 md:left-10 md:w-[400px] md:gap-4">
                <span className="label leading-[14px] text-text-muted max-md:text-white/80">
                    {counter}
                    {filmLabel}
                </span>
                <span className="font-display text-[52px] uppercase leading-[48px] text-text md:text-[72px] md:leading-16">
                    {project.title}
                </span>
                <div className="flex items-center gap-6">
                    {isVideo ? (
                        <>
                            <button type="button" onClick={controls.toggleSound} aria-pressed={!controls.muted} className="chrome-link label leading-[14px] text-text">
                                {controls.muted ? "Sound on" : "Sound off"}
                            </button>
                            <button type="button" onClick={controls.togglePause} className="chrome-link label leading-[14px] text-text max-md:hidden">
                                {controls.paused ? "Play" : "Pause"}
                            </button>
                        </>
                    ) : null}
                    <button type="button" onClick={onOpenInfo} className="chrome-link label flex items-center gap-2 leading-[14px] text-text md:hidden">
                        Info <PlusIcon />
                    </button>
                    {next ? (
                        <button
                            type="button"
                            onClick={onNext}
                            aria-label={`Next item, ${pad(index + 2)} of ${pad(total)}`}
                            className="chrome-link label ml-auto leading-[14px] text-text md:hidden"
                        >
                            Next ↓
                        </button>
                    ) : null}
                </div>
                {isVideo ? <ProgressLine ratio={ratio} className="md:hidden" /> : null}
            </div>

            <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 max-md:hidden">
                {next ? (
                    <>
                        <span className="label leading-[14px] text-text-muted">Next · {next.type === "video" ? "Film" : `Photo ${pad(index + 2)}`}</span>
                        <button
                            type="button"
                            onClick={onNext}
                            aria-label={`Next item, ${pad(index + 2)} of ${pad(total)}`}
                            className="chrome-link label leading-[14px] text-text"
                        >
                            Scroll or ↓
                        </button>
                    </>
                ) : (
                    <span className="label leading-[14px] text-text-muted">End of project</span>
                )}
            </div>
        </>
    );
}

function Filmstrip({ items, active, onPick }) {
    return (
        <nav aria-label="Jump to item" className="fixed right-10 top-1/2 z-20 flex max-h-[calc(100svh-260px)] -translate-y-1/2 flex-col gap-2 overflow-y-auto p-1 [scrollbar-width:none] max-md:hidden">
            {items.map((media, index) => (
                <button
                    key={media.id}
                    type="button"
                    onClick={() => onPick(index)}
                    aria-label={`Item ${index + 1}`}
                    aria-current={index === active ? "true" : undefined}
                    className={`relative h-12 w-9 shrink-0 overflow-hidden bg-surface transition-[outline-color,opacity] ${
                        index === active ? "outline outline-1 outline-offset-[3px] outline-text" : "opacity-60 hover:opacity-100"
                    }`}
                >
                    <Thumb media={media} />
                </button>
            ))}
        </nav>
    );
}

function Thumb({ media }) {
    const still = media.type === "video" ? media.poster : media;
    if (!still) return <span className="absolute inset-0 bg-surface" />;
    return <Photo media={{ ...still, alt: "" }} sizes="40px" />;
}

function Pips({ count, active, onPick }) {
    return (
        <nav
            aria-label="Jump to item"
            className="tone-dark fixed right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-[7px] rounded-full bg-[#0f0f0f66] px-1 py-2 md:hidden"
        >
            {Array.from({ length: count }, (_, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => onPick(index)}
                    aria-label={`Item ${index + 1}`}
                    aria-current={index === active ? "true" : undefined}
                    className={`w-[3px] rounded-full transition-all ${index === active ? "h-6 bg-text" : "h-2.5 bg-text/40"}`}
                />
            ))}
        </nav>
    );
}
