"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/smoothScroll";

/** Smooth wheel scrolling for the whole page. Touch keeps native scrolling; reduced motion turns it off. */
export function SmoothScroll() {
    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        let lenis = null;

        const start = () => {
            lenis = new Lenis({
                autoRaf: true,
                lerp: 0.1,
                anchors: true,
                prevent: (node) => Boolean(node.closest?.('[aria-modal="true"]')),
            });
            setLenis(lenis);
        };
        const stop = () => {
            lenis?.destroy();
            lenis = null;
            setLenis(null);
        };
        const sync = () => {
            if (query.matches) stop();
            else if (!lenis) start();
        };

        sync();
        query.addEventListener("change", sync);
        return () => {
            query.removeEventListener("change", sync);
            stop();
        };
    }, []);

    return null;
}
