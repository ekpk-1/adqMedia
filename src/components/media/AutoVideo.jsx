"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { previewSrc } from "@/content/previews";
import { useInView } from "@/hooks/useInView";
import { DEFAULT_VOLUME } from "@/lib/media";
import { claimPlayback } from "@/lib/playbackBudget";

const KEEP_LOADED_MARGIN = "100% 0px";

/**
 * Muted, looping video that only loads and plays while on screen and while
 * `active`. The poster (or `fallback`) shows until the first frame is ready.
 * Once it is more than a screen away it drops its source, so the browser stops
 * buffering it and frees the decoder.
 *
 * `preview` marks a decorative tile: it plays the small preview encode and
 * shares a playback budget with other tiles, so only the ones nearest the
 * middle of the screen play.
 */
export const AutoVideo = forwardRef(function AutoVideo(
    { media, active = true, loop = true, muted = true, contain = false, preview = false, fallback, className = "", threshold = 0.4 },
    forwardedRef
) {
    const wrapperRef = useRef(null);
    const videoRef = useRef(null);
    const inView = useInView(wrapperRef, { threshold });
    const nearView = useInView(wrapperRef, { threshold: 0, rootMargin: KEEP_LOADED_MARGIN });
    const [granted, setGranted] = useState(!preview);
    const [started, setStarted] = useState(false);
    const [ready, setReady] = useState(false);
    const wantsToPlay = active && inView;
    const shouldPlay = wantsToPlay && granted;
    const keepLoaded = nearView || inView;
    const src = preview ? previewSrc(media) : media.src;

    useImperativeHandle(forwardedRef, () => videoRef.current, []);

    useEffect(() => {
        if (!preview || !wantsToPlay) return undefined;
        return claimPlayback(wrapperRef.current, setGranted);
    }, [preview, wantsToPlay]);

    useEffect(() => {
        if (shouldPlay) setStarted(true);
    }, [shouldPlay]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !started) return;
        if (shouldPlay) video.play().catch(() => {});
        else video.pause();
    }, [shouldPlay, started]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !started || keepLoaded) return;
        video.pause();
        video.removeAttribute("src");
        video.load();
        setStarted(false);
        setReady(false);
    }, [keepLoaded, started]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.volume = DEFAULT_VOLUME;
        video.muted = muted;
    }, [muted]);

    const fit = contain ? "object-contain" : "object-cover";
    const poster = media.poster?.src;

    return (
        <div ref={wrapperRef} className={`relative size-full overflow-hidden ${className}`}>
            {fallback && !ready ? <div className="absolute inset-0">{fallback}</div> : null}
            <video
                ref={videoRef}
                src={started ? src : undefined}
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
