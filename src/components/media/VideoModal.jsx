"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/chrome/SiteHeader";
import { useDialog } from "@/hooks/useDialog";
import { useReducedMotion } from "@/hooks/useMediaPreferences";
import { useVideoClock } from "@/hooks/useVideoClock";
import { DEFAULT_VOLUME } from "@/lib/media";
import { formatDuration } from "@/lib/projects";

export function VideoModal({ current, onClose }) {
    const reduced = useReducedMotion();
    return (
        <AnimatePresence>
            {current ? (
                <motion.div
                    key={current.media.src}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.25 }}
                    className="tone-dark fixed inset-0 z-[60]"
                >
                    <ModalBody current={current} onClose={onClose} />
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

function ModalBody({ current, onClose }) {
    const { media, title, startAt } = current;
    const panelRef = useRef(null);
    const videoRef = useRef(null);
    const [muted, setMuted] = useState(true);
    const [paused, setPaused] = useState(false);
    const clock = useVideoClock(videoRef, media.duration);
    const ratio = clock.duration ? clock.current / clock.duration : 0;
    useDialog(panelRef, true, onClose);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.volume = DEFAULT_VOLUME;
        if (startAt) video.currentTime = startAt;
        video.play().catch(() => setPaused(true));
    }, [startAt]);

    const toggleSound = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !muted;
        video.volume = DEFAULT_VOLUME;
        setMuted(!muted);
    };
    const togglePause = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => {});
            setPaused(false);
        } else {
            video.pause();
            setPaused(true);
        }
    };
    const seek = (event) => {
        const video = videoRef.current;
        if (!video || !clock.duration) return;
        const box = event.currentTarget.getBoundingClientRect();
        video.currentTime = ((event.clientX - box.left) / box.width) * clock.duration;
    };

    return (
        <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="flex size-full flex-col bg-[#0f0f0ff2] text-text"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="flex items-center justify-between p-5 md:px-10 md:py-[28px]">
                <span className="label truncate text-text-muted">{title}</span>
                <button type="button" onClick={onClose} data-autofocus className="chrome-link label flex items-center gap-2 text-text">
                    Close <CloseIcon />
                </button>
            </div>
            <div
                className="relative flex min-h-0 flex-1 items-center justify-center px-5 md:px-10"
                onClick={(event) => {
                    if (event.target === event.currentTarget) onClose();
                }}
            >
                <video
                    ref={videoRef}
                    src={media.src}
                    poster={media.poster?.src}
                    muted
                    loop
                    playsInline
                    onClick={togglePause}
                    className="h-full w-auto max-w-full cursor-pointer object-contain"
                />
            </div>
            <div className="flex flex-col gap-4 p-5 md:px-10 md:pb-8 md:pt-6">
                <button type="button" onClick={seek} aria-label="Seek" className="group relative h-3 w-full">
                    <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-line" />
                    <span className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-text" style={{ width: `${ratio * 100}%` }} />
                </button>
                <div className="flex items-center justify-between gap-6">
                    <span className="label-plain tabular-nums text-text-muted">
                        {formatDuration(clock.current)} / {formatDuration(clock.duration)}
                    </span>
                    <span className="flex gap-6">
                        <button type="button" onClick={togglePause} className="chrome-link label text-text">
                            {paused ? "Play" : "Pause"}
                        </button>
                        <button type="button" onClick={toggleSound} aria-pressed={!muted} className="chrome-link label text-text">
                            {muted ? "Sound on" : "Sound off"}
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
}
