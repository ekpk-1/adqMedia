"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { VideoModal } from "@/components/media/VideoModal";

const VideoModalContext = createContext(null);

export function VideoModalProvider({ children }) {
    const [current, setCurrent] = useState(null);

    const open = useCallback((media, { title, startAt = 0 } = {}) => {
        setCurrent({ media, title: title ?? media.alt, startAt });
    }, []);
    const close = useCallback(() => setCurrent(null), []);
    const value = useMemo(() => ({ open, close, isOpen: current !== null }), [open, close, current]);

    return (
        <VideoModalContext.Provider value={value}>
            {children}
            <VideoModal current={current} onClose={close} />
        </VideoModalContext.Provider>
    );
}

/** `open(media, { title, startAt })` plays a film in the modal, muted. */
export function useVideoModal() {
    const context = useContext(VideoModalContext);
    if (!context) throw new Error("useVideoModal must be used inside VideoModalProvider");
    return context;
}
