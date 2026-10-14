"use client";

import { useEffect, useState } from "react";
import { useMenu } from "@/components/providers/MenuProvider";
import { Wordmark } from "./Wordmark";

export function PlusIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="shrink-0">
            <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    );
}

export function CloseIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="shrink-0">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    );
}

export function MenuButton() {
    const { open, isOpen } = useMenu();
    return (
        <button
            type="button"
            onClick={open}
            aria-expanded={isOpen}
            aria-controls="site-menu"
            className="chrome-link label flex items-center gap-[6px] text-text md:gap-2"
        >
            Menu
            <PlusIcon />
        </button>
    );
}

function useScrolledPast(offset = 24) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const update = () => setScrolled(window.scrollY > offset);
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, [offset]);
    return scrolled;
}

/**
 * Wordmark left, optional centre control, actions right (the menu by default).
 * Fixed by default so it follows the page; once the page scrolls, a soft fade
 * of the page colour sits behind it to keep it legible over content.
 * Pass `position="static"` to keep it in normal flow.
 */
export function SiteHeader({ center, centerOnMobile = false, actions, position = "fixed", scrim = true, className = "" }) {
    const scrolled = useScrolledPast();
    const positionClass = position === "static" ? "relative" : position;
    return (
        <header
            className={`${positionClass} inset-x-0 top-0 z-30 flex items-center justify-between p-5 md:px-10 md:py-[28px] ${className}`}
        >
            {scrim && position !== "static" ? (
                <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140%] bg-gradient-to-b from-background via-background/80 to-transparent transition-opacity duration-300 ${
                        scrolled ? "opacity-100" : "opacity-0"
                    }`}
                />
            ) : null}
            <div className="flex w-[200px] max-md:w-auto">
                <Wordmark />
            </div>
            {center ? (
                <div className={`flex justify-center ${centerOnMobile ? "" : "max-md:hidden"}`}>{center}</div>
            ) : null}
            <div className="flex w-[200px] items-center justify-end gap-8 max-md:w-auto max-md:gap-5">
                {actions ?? <MenuButton />}
            </div>
        </header>
    );
}
