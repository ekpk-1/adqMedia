"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * Muted, looping video that only loads and plays while on screen and while
 * `active`. The poster (or `fallback`) shows until the first frame is ready.
 */
export const AutoVideo = forwardRef(function AutoVideo(
    { media, active = true, loop = true, muted = true, contain = false, fallback, className = "", threshold = 0.4 },
    forwardedRef
) {
    const wrapperRef = useRef(null);
    const videoRef = useRef(null);
    const inView = useInView(wrapperRef, { threshold });
    const [started, setStarted] = useState(false);
    const [ready, setReady] = useState(false);
    const shouldPlay = active && inView;

    useImperativeHandle(forwardedRef, () => videoRef.current, []);

    useEffect(() => {
        if (shouldPlay) setStarted(true);
    }, [shouldPlay]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !started) return;
        if (shouldPlay) {
            video.play().catch(() => {
                // Autoplay can be refused (e.g. low-power mode); the poster stays up.
            });
        } else {
            video.pause();
        }
    }, [shouldPlay, started]);

    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = muted;
    }, [muted]);

    const fit = contain ? "object-contain" : "object-cover";
    const poster = media.poster?.src;

    return (
        <div ref={wrapperRef} className={`relative size-full overflow-hidden ${className}`}>
            {fallback && !ready ? <div className="absolute inset-0">{fallback}</div> : null}
            <video
                ref={videoRef}
                src={started ? media.src : undefined}
                poster={fallback ? undefined : poster}
                muted={muted}
                loop={loop}
                playsInline
                preload="none"
                aria-label={media.alt}
                onLoadedData={() => setReady(true)}
                className={`absolute inset-0 size-full ${fit} transition-opacity duration-300 ${
                    fallback && !ready ? "opacity-0" : "opacity-100"
                }`}
            />
        </div>
    );
});
