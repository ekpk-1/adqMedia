"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoModal } from "@/components/providers/VideoModalProvider";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useMediaPreferences";
import { useVideoClock } from "@/hooks/useVideoClock";
import { DEFAULT_VOLUME } from "@/lib/media";
import { formatDuration } from "@/lib/projects";

const LANDING_OFFSET = 140;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

function introRect(vw, vh) {
    if (vw < 768) {
        const width = vw - 80;
        const height = width * 1.25;
        return { left: 40, top: (vh - height) / 2 + 8, width, height };
    }
    const width = Math.min(Math.max(vw * 0.3944, 320), 820);
    const height = (width * 368) / 568;
    return { left: (vw - width) / 2, top: (vh - height) / 2, width, height };
}

/**
 * The homepage intro: the showreel plays inside a viewfinder between
 * "Cars," and "framed.", then grows into the first tile of the grid as the
 * visitor scrolls. One <video> element does both jobs.
 */
export function ReelIntro({ reel, pageRef, slotRef }) {
    const layerRef = useRef(null);
    const videoRef = useRef(null);
    const reduced = useReducedMotion();
    const inView = useInView(layerRef, { threshold: 0 });
    const playing = !reduced && inView;
    const [muted, setMuted] = useState(true);
    const [measured, setMeasured] = useState(false);
    const clock = useVideoClock(videoRef, reel.duration);
    const modal = useVideoModal();

    // A passive effect, because the page and slot refs belong to later
    // siblings and aren't attached yet when this component's layout effects run.
    useEffect(() => {
        const page = pageRef.current;
        const slot = slotRef.current;
        const layer = layerRef.current;
        if (!page || !slot || !layer) return undefined;

        let frame = 0;
        let geometry = null;

        const measure = () => {
            const pageBox = page.getBoundingClientRect();
            const slotBox = slot.getBoundingClientRect();
            const pageTop = pageBox.top + window.scrollY;
            geometry = {
                vw: document.documentElement.clientWidth,
                vh: window.innerHeight,
                pageTop,
                pageLeft: pageBox.left,
                slot: {
                    left: slotBox.left - pageBox.left,
                    top: slotBox.top + window.scrollY - pageTop,
                    width: slotBox.width,
                    height: slotBox.height,
                },
            };
            const start = introRect(geometry.vw, geometry.vh);
            page.style.setProperty("--frame-top", `${start.top}px`);
            page.style.setProperty("--frame-bottom", `${start.top + start.height}px`);
        };

        const paint = () => {
            frame = 0;
            if (!geometry) return;
            const { vw, vh, pageTop, slot: target } = geometry;
            const scroll = window.scrollY;
            const landing = Math.max(1, pageTop + target.top - LANDING_OFFSET);
            const progress = reduced ? 1 : Math.min(Math.max(scroll / landing, 0), 1);
            const t = ease(progress);
            const start = introRect(vw, vh);
            // Interpolate in viewport space so the reel holds still while the page moves under it.
            const slotInViewport = { top: pageTop + target.top - scroll, left: target.left };
            const top = lerp(start.top, slotInViewport.top, t) + scroll - pageTop;
            Object.assign(layer.style, {
                left: `${lerp(start.left, target.left, t)}px`,
                top: `${top}px`,
                width: `${lerp(start.width, target.width, t)}px`,
                height: `${lerp(start.height, target.height, t)}px`,
                translate: "none",
            });
            page.style.setProperty("--p", progress.toFixed(4));
        };

        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(paint);
        };
        const remeasure = () => {
            measure();
            schedule();
        };

        remeasure();
        setMeasured(true);
        const observer = new ResizeObserver(remeasure);
        observer.observe(page);
        observer.observe(slot);
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", remeasure);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", remeasure);
        };
    }, [pageRef, slotRef, reduced]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (playing) video.play().catch(() => {});
        else video.pause();
    }, [playing]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.volume = DEFAULT_VOLUME;
        video.muted = muted;
    }, [muted]);

    const openModal = () => {
        setMuted(true);
        modal.open(reel, { title: reel.caption, startAt: videoRef.current?.currentTime ?? 0 });
    };

    const progressRatio = clock.duration ? clock.current / clock.duration : 0;
    const fadeEarly = { opacity: "calc(1 - var(--p, 0) * 3)" };

    return (
        <>
            <section aria-label="Introduction" className="relative h-svh overflow-hidden">
                <h1 className="sr-only">ADQ Media — car photography and film in Melbourne</h1>
                <IntroWord side="left">Cars,</IntroWord>
                <IntroWord side="right">framed.</IntroWord>

                <div
                    className="absolute inset-x-5 bottom-[30px] flex items-end justify-between md:inset-x-10 md:bottom-[36px]"
                    style={fadeEarly}
                >
                    <div className="flex flex-col gap-1">
                        <span className="label text-text-muted">Automotive photo and film</span>
                        <span className="label text-text">Melbourne, AU</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setMuted((value) => !value)}
                        aria-pressed={!muted}
                        className="chrome-link label absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-text max-md:hidden"
                    >
                        <SoundIcon muted={muted} />
                        {muted ? "Sound off" : "Sound on"}
                    </button>
                    <div className="flex flex-col items-center gap-2.5">
                        <span className="label text-text">Scroll</span>
                        <span aria-hidden className="h-10 w-px bg-text" />
                    </div>
                </div>
            </section>

            <div
                ref={layerRef}
                className={`absolute left-1/2 top-[50svh] z-10 aspect-[4/5] w-[calc(100vw-80px)] -translate-x-1/2 -translate-y-1/2 md:aspect-[568/368] md:w-[39.44vw] ${
                    measured ? "" : "opacity-0"
                }`}
            >
                <div
                    aria-hidden
                    className="viewfinder vf-on pointer-events-none absolute inset-0 [--vf-inset:-16px] [--vf-size:28px] md:[--vf-size:36px]"
                    style={{ opacity: "calc(1 - var(--p, 0) * 1.6)" }}
                />
                <button
                    type="button"
                    onClick={openModal}
                    aria-haspopup="dialog"
                    aria-label="Play the showreel"
                    className="tone-dark group absolute inset-0 overflow-hidden bg-background outline-none"
                >
                    <video
                        ref={videoRef}
                        src={reduced ? undefined : reel.src}
                        poster={reel.poster.src}
                        muted
                        loop
                        playsInline
                        autoPlay={!reduced}
                        preload="auto"
                        className="size-full object-cover"
                    />
                    <span
                        aria-hidden
                        className="viewfinder vf-group absolute inset-5 [--vf-size:28px] [--vf-inset:0px]"
                        style={{ opacity: "var(--p, 0)" }}
                    />
                </button>
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-white/25" style={fadeEarly}>
                    <div className="h-full bg-white" style={{ width: `${progressRatio * 100}%` }} />
                </div>
                <div
                    className="absolute inset-x-[-16px] top-[calc(100%+34px)] flex justify-between max-md:hidden"
                    style={fadeEarly}
                >
                    <span className="label text-text">{reel.caption}</span>
                    <span className="label-plain text-text-muted">
                        {formatDuration(clock.current)} / {formatDuration(clock.duration)}
                    </span>
                </div>
            </div>
        </>
    );
}

function IntroWord({ side, children }) {
    const left = side === "left";
    return (
        <span
            aria-hidden
            className={`absolute text-[56px] font-medium leading-[60px] tracking-[-0.025em] text-text md:top-1/2 md:-translate-y-1/2 md:text-[clamp(56px,5.625vw,108px)] md:leading-[1.08] ${
                left
                    ? "left-5 top-[calc(var(--frame-top,30svh)-76px)] md:left-10"
                    : "right-5 top-[calc(var(--frame-bottom,70svh)+16px)] md:right-10"
            }`}
            style={{
                transform: `translateX(calc(var(--p, 0) * ${left ? "-" : ""}38vw))`,
                opacity: "calc(1 - var(--p, 0) * 1.2)",
            }}
        >
            {children}
        </span>
    );
}

function SoundIcon({ muted }) {
    return (
        <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden>
            <path d="M0 4h3l4-4v12L3 8H0z" fill="currentColor" />
            {muted ? (
                <path d="M10 4l4 4M14 4l-4 4" stroke="currentColor" strokeWidth="1.2" />
            ) : (
                <path d="M10 3.5c1 .8 1.5 1.6 1.5 2.5S11 7.7 10 8.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
            )}
        </svg>
    );
}
