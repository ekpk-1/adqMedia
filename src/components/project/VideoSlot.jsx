"use client";

import { useRef, useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { useVideoModal } from "@/components/providers/VideoModalProvider";
import { useCanAutoplay } from "@/hooks/useMediaPreferences";
import { useVideoClock } from "@/hooks/useVideoClock";
import { DEFAULT_VOLUME } from "@/lib/media";
import { formatDuration } from "@/lib/projects";

export function useVideoControls(videoRef, media) {
    const [muted, setMuted] = useState(true);
    const [paused, setPaused] = useState(false);
    const modal = useVideoModal();

    const toggleSound = () => {
        const video = videoRef.current;
        const next = !muted;
        setMuted(next);
        if (video) {
            video.volume = DEFAULT_VOLUME;
            video.muted = next;
            if (!next) video.play().catch(() => {});
        }
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

    /** Opens the film in the modal, muted, from where the inline copy is. */
    const expand = () => {
        const video = videoRef.current;
        if (video) video.muted = true;
        setMuted(true);
        modal.open(media, { startAt: video?.currentTime ?? 0 });
    };

    return { muted, paused, toggleSound, togglePause, expand };
}

export function ProgressLine({ ratio, className = "" }) {
    return (
        <div aria-hidden className={`relative h-0.5 w-full bg-line ${className}`}>
            <div className="absolute inset-y-0 left-0 bg-text" style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
        </div>
    );
}

/** A 9:16 film in the layout view, with timecode, sound, expand and progress. */
export function VideoSlot({ media }) {
    const videoRef = useRef(null);
    const canAutoplay = useCanAutoplay();
    const clock = useVideoClock(videoRef, media.duration);
    const controls = useVideoControls(videoRef, media);
    const ratio = clock.duration ? clock.current / clock.duration : 0;

    return (
        <div className="tone-dark relative size-full overflow-hidden bg-background">
            <AutoVideo ref={videoRef} media={media} active={canAutoplay && !controls.paused} muted={controls.muted} />
            <button
                type="button"
                onClick={controls.expand}
                aria-haspopup="dialog"
                aria-label={`Play ${media.alt}`}
                className="absolute inset-0 cursor-zoom-in outline-none"
            />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-b from-transparent to-[#0f0f0fbf]" />
            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-[14px] md:inset-x-6 md:bottom-6">
                <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                        <span
                            aria-hidden
                            className={`size-[7px] rounded-full bg-accent-hover transition-opacity ${clock.playing ? "opacity-100" : "opacity-0"}`}
                        />
                        <span className="label leading-[14px] text-text">
                            Film · {formatDuration(clock.current)} / {formatDuration(clock.duration)}
                        </span>
                    </span>
                    <span className="flex gap-5">
                        <button type="button" onClick={controls.toggleSound} aria-pressed={!controls.muted} className="chrome-link label leading-[14px] text-text">
                            {controls.muted ? "Sound off" : "Sound on"}
                        </button>
                        <button type="button" onClick={controls.expand} aria-haspopup="dialog" className="chrome-link label leading-[14px] text-text">
                            Expand
                        </button>
                    </span>
                </div>
                <ProgressLine ratio={ratio} />
            </div>
        </div>
    );
}
