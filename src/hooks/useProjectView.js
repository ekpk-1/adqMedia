"use client";

import { useCallback, useEffect, useState } from "react";
import { PROJECT_VIEW_KEY } from "@/lib/theme";

/**
 * Layout or scroll. The boot script has already picked one (stored choice,
 * else layout on desktop and scroll on mobile) and written it to <html>.
 */
export function useProjectView() {
    const [view, setViewState] = useState("layout");

    useEffect(() => {
        if (document.documentElement.dataset.projectView === "scroll") setViewState("scroll");
    }, []);

    const setView = useCallback((next) => {
        try {
            localStorage.setItem(PROJECT_VIEW_KEY, next);
        } catch {
            // Storage blocked: the choice lasts for this page view.
        }
        document.documentElement.dataset.projectView = next;
        setViewState(next);
    }, []);

    return [view, setView];
}
