"use client";

import { useEffect, useState } from "react";

/** Current time and duration of a <video>, updated while it plays. */
export function useVideoClock(videoRef, fallbackDuration = 0) {
    const [clock, setClock] = useState({ current: 0, duration: fallbackDuration, playing: false });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return undefined;
        let frame = 0;

        const read = () =>
            setClock({
                current: video.currentTime,
                duration: Number.isFinite(video.duration) ? video.duration : fallbackDuration,
                playing: !video.paused,
            });

        const tick = () => {
            read();
            frame = requestAnimationFrame(tick);
        };
        const onPlay = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(tick);
        };
        const onStop = () => {
            cancelAnimationFrame(frame);
            read();
        };

        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onStop);
        video.addEventListener("loadedmetadata", read);
        video.addEventListener("seeked", read);
        if (!video.paused) onPlay();
        return () => {
            cancelAnimationFrame(frame);
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onStop);
            video.removeEventListener("loadedmetadata", read);
            video.removeEventListener("seeked", read);
        };
    }, [videoRef, fallbackDuration]);

    return clock;
}
