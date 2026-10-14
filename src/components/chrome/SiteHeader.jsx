"use client";

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

/**
 * Wordmark left, optional centre control, actions right (the menu by default).
 * `position` is "absolute" over intros and full-screen views, "fixed" over
 * the scroll view, or "static" in normal flow.
 */
export function SiteHeader({ center, centerOnMobile = false, actions, position = "absolute", className = "" }) {
    const positionClass =
        position === "fixed" ? "fixed" : position === "absolute" ? "absolute" : "relative";
    return (
        <header
            className={`${positionClass} inset-x-0 top-0 z-30 flex items-center justify-between p-5 md:px-10 md:py-[28px] ${className}`}
        >
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
