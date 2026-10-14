"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { Photo } from "@/components/media/Photo";
import { useMenu } from "@/components/providers/MenuProvider";
import { useCanAutoplay } from "@/hooks/useMediaPreferences";
import { useVideoClock } from "@/hooks/useVideoClock";
import { metaLabel } from "./ProjectTile";

const pad = (n) => String(n).padStart(2, "0");
const WHEEL_THRESHOLD = 40;
const STEP_LOCK_MS = 650;

function circularOffset(index, active, count) {
    let offset = index - active;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
}

function slideStyle(offset) {
    const visible = Math.abs(offset) <= 1;
    const x = offset === 0 ? "0px" : `calc(${offset} * var(--neighbour-x))`;
    return {
        transform: `translateX(${x}) scale(${offset === 0 ? 1 : 0.4923})`,
        opacity: offset === 0 ? 1 : visible ? 0.3 : 0,
        zIndex: offset === 0 ? 2 : 1,
        pointerEvents: visible ? "auto" : "none",
    };
}

/** No-scroll index: one project centred, neighbours either side. */
export function Carousel({ projects }) {
    const [active, setActive] = useState(0);
    const router = useRouter();
    const { isOpen: menuOpen } = useMenu();
    const lockRef = useRef(0);
    const wheelRef = useRef(0);
    const pointerRef = useRef(null);
    const count = projects.length;

    useEffect(() => {
        setActive((value) => (value >= count ? 0 : value));
    }, [count]);

    const step = useCallback(
        (direction) => {
            const now = Date.now();
            if (now < lockRef.current || count < 2) return;
            lockRef.current = now + STEP_LOCK_MS;
            setActive((value) => (value + direction + count) % count);
        },
        [count]
    );

    useEffect(() => {
        if (menuOpen) return undefined;
        const onKey = (event) => {
            if (event.key === "ArrowRight") step(1);
            else if (event.key === "ArrowLeft") step(-1);
            else if (event.key === "Enter" && document.activeElement === document.body) {
                router.push(`/work/${projects[active]?.slug}`);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen, step, router, projects, active]);

    const onWheel = (event) => {
        wheelRef.current += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (Math.abs(wheelRef.current) >= WHEEL_THRESHOLD) {
            step(Math.sign(wheelRef.current));
            wheelRef.current = 0;
        }
    };

    const onPointerDown = (event) => {
        pointerRef.current = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = (event) => {
        const start = pointerRef.current;
        pointerRef.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(event.clientY - start.y)) step(dx < 0 ? 1 : -1);
    };

    if (!count) return <EmptyState />;
    const current = projects[active];

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Projects"
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            data-lenis-prevent
            className="fixed inset-0 touch-pan-y overflow-hidden select-none [--carousel-top:150px] [--carousel-w:calc(100vw-96px)] [--neighbour-x:calc(50vw+8px)] md:[--carousel-top:120px] md:[--carousel-w:min(54.17vw,calc((100svh-380px)*1.5))] md:[--neighbour-x:45vw]"
        >
            {projects.map((project, index) => {
                const offset = circularOffset(index, active, count);
                return (
                    <Slide
                        key={project.slug}
                        project={project}
                        offset={offset}
                        onSelect={() => (offset === 0 ? null : step(Math.sign(offset)))}
                    />
                );
            })}

            <div
                aria-live="polite"
                className="absolute left-1/2 top-[calc(var(--carousel-top)+var(--carousel-w)/1.5+28px)] z-10 flex w-(--carousel-w) -translate-x-1/2 items-end justify-between"
            >
                <div className="flex min-w-0 flex-col gap-[6px]">
                    <span className="label text-text-muted">
                        {metaLabel(current)}
                    </span>
                    <Link
                        href={`/work/${current.slug}`}
                        className="chrome-link truncate text-heading font-medium tracking-[-0.02em] text-text md:text-title"
                    >
                        {current.title}
                    </Link>
                </div>
                <div className="flex items-baseline gap-1 pb-2.5">
                    <span className="text-subhead font-medium text-text">{pad(active + 1)}</span>
                    <span className="label-plain text-text-muted">/ {pad(count)}</span>
                </div>
            </div>

            <div className="absolute inset-x-5 bottom-[30px] z-10 flex items-center justify-between md:inset-x-10 md:bottom-[36px]">
                <button type="button" onClick={() => step(-1)} className="chrome-link label w-[100px] text-left text-text-muted hover:text-text md:w-[200px]">
                    ← Prev
                </button>
                <TickRuler count={count} active={active} onPick={setActive} />
                <button type="button" onClick={() => step(1)} className="chrome-link label w-[100px] text-right text-text md:w-[200px]">
                    Next →
                </button>
            </div>
        </section>
    );
}

function Slide({ project, offset, onSelect }) {
    const isActive = offset === 0;
    const canAutoplay = useCanAutoplay();
    const videoRef = useRef(null);
    const showVideo = canAutoplay && project.coverVideo;
    const cover = <Photo media={project.cover} sizes="(max-width: 767px) 90vw, 55vw" priority={isActive} />;

    const media = (
        <div className="absolute inset-0 overflow-hidden bg-surface">
            {showVideo ? (
                <AutoVideo ref={videoRef} media={project.coverVideo} active={isActive} fallback={project.cover ? cover : null} />
            ) : (
                cover
            )}
            {isActive && showVideo ? <VideoProgress videoRef={videoRef} duration={project.coverVideo.duration} /> : null}
        </div>
    );

    const shared = {
        className:
            "absolute left-[calc(50%-var(--carousel-w)/2)] top-(--carousel-top) aspect-[3/2] w-(--carousel-w) transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] outline-none",
        style: slideStyle(offset),
    };

    if (isActive) {
        return (
            <Link href={`/work/${project.slug}`} aria-label={`${project.title}, ${metaLabel(project)}`} {...shared}>
                {media}
            </Link>
        );
    }
    return (
        <button
            type="button"
            tabIndex={Math.abs(offset) === 1 ? 0 : -1}
            aria-label={`Show ${project.title}`}
            onClick={onSelect}
            {...shared}
        >
            {media}
        </button>
    );
}

function VideoProgress({ videoRef, duration }) {
    const clock = useVideoClock(videoRef, duration);
    const ratio = clock.duration ? clock.current / clock.duration : 0;
    return (
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-white/25">
            <div className="h-full bg-white" style={{ width: `${ratio * 100}%` }} />
        </div>
    );
}

function TickRuler({ count, active, onPick }) {
    return (
        <div className="flex h-4 items-end gap-[10px] md:gap-[14px]" role="group" aria-label="Jump to project">
            {Array.from({ length: count }, (_, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => onPick(index)}
                    aria-label={`Project ${index + 1}`}
                    aria-current={index === active ? "true" : undefined}
                    className="group -mx-1 flex h-4 items-end px-1"
                >
                    <span
                        className={`block transition-all ${
                            index === active ? "h-4 w-0.5 bg-accent" : "h-2 w-px bg-line group-hover:bg-text"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex h-svh items-center justify-center">
            <p className="label text-text-muted">No projects in this filter yet</p>
        </div>
    );
}
