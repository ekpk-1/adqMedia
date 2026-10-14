"use client";

import { useEffect, useState } from "react";

export function useInView(ref, { threshold = 0.25, rootMargin = "0px", root = null } = {}) {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold, rootMargin, root: root?.current ?? null }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [ref, threshold, rootMargin, root]);

    return inView;
}
