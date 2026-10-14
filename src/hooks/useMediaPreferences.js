"use client";

import { useSyncExternalStore } from "react";

function subscribeToQuery(query) {
    return (callback) => {
        const list = matchMedia(query);
        list.addEventListener("change", callback);
        return () => list.removeEventListener("change", callback);
    };
}

function useMediaQuery(query, serverValue = false) {
    return useSyncExternalStore(
        subscribeToQuery(query),
        () => matchMedia(query).matches,
        () => serverValue
    );
}

export function useReducedMotion() {
    return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsMobile() {
    return useMediaQuery("(max-width: 767px)");
}

const noopSubscribe = () => () => {};

/** True when the visitor asked to save data or is on a 2G-class connection. */
export function useSlowConnection() {
    return useSyncExternalStore(
        noopSubscribe,
        () => {
            const connection = navigator.connection;
            if (!connection) return false;
            return Boolean(connection.saveData) || /(^|-)2g$/.test(connection.effectiveType ?? "");
        },
        () => false
    );
}

/** Thumbnails and previews only autoplay when motion and bandwidth allow it. */
export function useCanAutoplay() {
    const reduced = useReducedMotion();
    const slow = useSlowConnection();
    return !reduced && !slow;
}
