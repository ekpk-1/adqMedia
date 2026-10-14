"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMenu } from "@/components/providers/MenuProvider";
import { useDialog } from "@/hooks/useDialog";
import { useCanAutoplay } from "@/hooks/useMediaPreferences";
import { CloseIcon } from "./SiteHeader";
import { MelbourneClock } from "./MelbourneClock";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

function currentSection(pathname) {
    if (pathname.startsWith("/info")) return 1;
    return 0;
}

export function MenuOverlay({ projectCount, email, socials, reel }) {
    const { isOpen, close } = useMenu();
    const pathname = usePathname();
    const panelRef = useRef(null);
    const [hovered, setHovered] = useState(null);
    useDialog(panelRef, isOpen, close);

    useEffect(() => {
        if (!isOpen) setHovered(null);
    }, [isOpen]);

    const rows = [
        { id: "work", href: "/", word: "Work", note: `${projectCount} projects — Creative, Commercial →` },
        { id: "info", href: "/info", word: "Info", note: "About, services, clients" },
        { id: "contact", href: "/info#contact", word: "Contact", note: "Book a shoot" },
    ];
    const active = hovered ?? currentSection(pathname);

    return (
        <AnimatePresence>
            {isOpen ? (
                <motion.div
                    key="menu"
                    id="site-menu"
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="fixed inset-0 z-50 flex flex-col bg-background text-text"
                >
                    <div className="flex items-center justify-between p-5 md:px-10 md:py-[28px]">
                        <Wordmark onClick={close} />
                        <span className="max-md:hidden">
                            <MelbourneClock />
                        </span>
                        <button
                            type="button"
                            onClick={close}
                            data-autofocus
                            className="chrome-link label flex items-center gap-2 text-text"
                        >
                            Close
                            <CloseIcon />
                        </button>
                    </div>

                    <nav aria-label="Main" className="relative flex flex-1 flex-col" onMouseLeave={() => setHovered(null)}>
                        <ReelStrip reel={reel} index={active} />
                        {rows.map((row, index) => (
                            <MenuRow
                                key={row.id}
                                row={row}
                                index={index}
                                isActive={active === index}
                                onHover={() => setHovered(index)}
                                onNavigate={close}
                            />
                        ))}
                    </nav>

                    <div className="flex items-center justify-between gap-5 p-5 max-md:flex-col max-md:items-start md:px-10 md:py-9">
                        <a href={`mailto:${email}`} className="chrome-link text-body font-medium text-text">
                            {email}
                        </a>
                        <div className="flex gap-8">
                            {socials.map((social) => (
                                <a
                                    key={social.url}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="chrome-link label text-text"
                                >
                                    {social.label} ↗
                                </a>
                            ))}
                        </div>
                        <ThemeToggle />
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

function MenuRow({ row, index, isActive, onHover, onNavigate }) {
    return (
        <Link
            href={row.href}
            onClick={onNavigate}
            onMouseEnter={onHover}
            onFocus={onHover}
            aria-current={isActive ? "true" : undefined}
            className={`group relative z-10 flex min-h-[100px] flex-1 overflow-hidden border-b outline-none ${
                isActive ? "tone-dark border-b-2 border-accent" : "border-line"
            }`}
        >
            <span className="label-plain absolute left-5 top-4 text-text md:left-10 md:top-5">
                {String(index + 1).padStart(2, "0")}
            </span>
            <motion.span
                initial={{ y: "40%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 + index * 0.06, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className={`absolute left-14 top-1/2 -translate-y-1/2 font-display uppercase leading-[0.84] transition-opacity md:left-[112px] ${
                    isActive ? "opacity-100" : "opacity-100 [:root:not(.theme-light)_&]:opacity-[0.32]"
                }`}
                style={{ fontSize: "clamp(84px, min(24vh, 16.6vw), 240px)" }}
            >
                {row.word}
            </motion.span>
            <span className="label absolute bottom-4 right-5 text-text max-md:hidden md:bottom-5 md:right-10">
                {row.note}
            </span>
        </Link>
    );
}

function ReelStrip({ reel, index }) {
    const canPlay = useCanAutoplay();
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (canPlay) video.play().catch(() => {});
        else video.pause();
    }, [canPlay]);

    return (
        <div
            aria-hidden
            className="tone-dark pointer-events-none absolute inset-x-0 overflow-hidden bg-background transition-[top] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ top: `${(index * 100) / 3}%`, height: `${100 / 3}%` }}
        >
            {canPlay ? (
                <video
                    ref={videoRef}
                    src={reel.src}
                    poster={reel.poster.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="size-full object-cover"
                />
            ) : (
                <img src={reel.poster.src} alt="" className="size-full object-cover" />
            )}
            <div className="absolute inset-0 bg-overlay" />
        </div>
    );
}
