"use client";

import { useEffect } from "react";
import { lockScroll } from "@/lib/smoothScroll";

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour for an open overlay: Esc closes it, Tab stays inside it,
 * focus moves in on open and the page behind stops scrolling.
 */
export function useDialog(ref, isOpen, onClose) {
    useEffect(() => {
        if (!isOpen) return undefined;
        const node = ref.current;
        if (!node) return undefined;

        const opener = document.activeElement;
        const previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        const unlockScroll = lockScroll();

        const visible = (element) => element.offsetParent !== null;
        const first =
            [...node.querySelectorAll("[data-autofocus]")].find(visible) ??
            [...node.querySelectorAll(FOCUSABLE)].find(visible);
        first?.focus({ preventScroll: true });

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                event.stopPropagation();
                onClose();
                return;
            }
            if (event.key !== "Tab") return;
            const focusable = [...node.querySelectorAll(FOCUSABLE)].filter(
                (element) => element.offsetParent !== null || element === document.activeElement
            );
            if (!focusable.length) return;
            const firstEl = focusable[0];
            const lastEl = focusable.at(-1);
            if (event.shiftKey && document.activeElement === firstEl) {
                event.preventDefault();
                lastEl.focus();
            } else if (!event.shiftKey && document.activeElement === lastEl) {
                event.preventDefault();
                firstEl.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.documentElement.style.overflow = previousOverflow;
            unlockScroll();
            if (opener?.isConnected) opener.focus({ preventScroll: true });
        };
    }, [ref, isOpen, onClose]);
}
