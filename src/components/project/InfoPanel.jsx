"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { CloseIcon } from "@/components/chrome/SiteHeader";
import { useDialog } from "@/hooks/useDialog";
import { useIsMobile, useReducedMotion } from "@/hooks/useMediaPreferences";

function specRows(project) {
    return [
        { label: "Category", value: project.category === "creative" ? "Creative" : "Commercial" },
        { label: "Client", value: project.client.name },
        { label: "Contents", value: project.contentsLong },
        project.location ? { label: "Location", value: project.location } : null,
        ...project.credits.map((credit) => ({ label: credit.role, value: credit.name })),
        project.date ? { label: "Date", value: project.date } : null,
    ].filter(Boolean);
}

/** Project info: a 560px panel from the right on desktop, a bottom sheet on mobile. */
export function InfoPanel({ project, isOpen, onClose }) {
    const panelRef = useRef(null);
    const mobile = useIsMobile();
    const reduced = useReducedMotion();
    useDialog(panelRef, isOpen, onClose);

    const hidden = mobile ? { y: "100%" } : { x: "100%" };
    const shown = mobile ? { y: 0 } : { x: 0 };
    const transition = reduced ? { duration: 0 } : { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] };

    return (
        <AnimatePresence>
            {isOpen ? (
                <div className="fixed inset-0 z-40" key="info">
                    <motion.div
                        aria-hidden
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.3 }}
                        className="absolute inset-0 bg-[#0f0f0fb8]"
                    />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="project-info-title"
                        initial={hidden}
                        animate={shown}
                        exit={hidden}
                        transition={transition}
                        drag={mobile ? "y" : false}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.6 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 120 || info.velocity.y > 600) onClose();
                        }}
                        className="absolute flex flex-col justify-between gap-10 overflow-y-auto bg-surface text-text max-md:inset-x-0 max-md:bottom-0 max-md:max-h-[92svh] max-md:rounded-t-2xl max-md:px-5 max-md:pb-7 max-md:pt-3 md:inset-y-0 md:right-0 md:w-[560px] md:px-12 md:pb-12 md:pt-[28px]"
                    >
                        <div className="flex flex-col gap-8 md:gap-10">
                            <span aria-hidden className="mx-auto h-1 w-10 rounded-full bg-text/30 md:hidden" />
                            <div className="flex h-10 items-center justify-between max-md:hidden">
                                <span className="label leading-[14px] text-text-muted">Project info</span>
                                <CloseButton onClose={onClose} />
                            </div>
                            <div className="flex items-end justify-between gap-4">
                                <h2 id="project-info-title" className="font-display text-[56px] uppercase leading-[52px] md:text-[72px] md:leading-16">
                                    {project.title}
                                </h2>
                                <span className="pb-2 md:hidden">
                                    <CloseButton onClose={onClose} />
                                </span>
                            </div>
                            <dl className="flex flex-col border-t border-line">
                                {specRows(project).map((row) => (
                                    <div key={row.label} className="flex items-center justify-between gap-6 border-b border-line py-[11px] md:py-[9px]">
                                        <dt className="label leading-[14px] text-text-muted">{row.label}</dt>
                                        <dd className="text-right text-[14px] leading-[18px]">{row.value}</dd>
                                    </div>
                                ))}
                            </dl>
                            {project.info?.lead ? (
                                <div className="flex flex-col gap-4">
                                    <span className="label leading-[14px] text-text-muted">About the shoot</span>
                                    <p className="text-[18px] leading-[28px]">{project.info.lead}</p>
                                    {project.info.body ? (
                                        <p className="text-[15px] leading-6 text-text-muted">{project.info.body}</p>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                        <Link
                            href={`/info?project=${project.slug}#contact`}
                            onClick={onClose}
                            className="btn btn-primary viewfinder w-full"
                        >
                            Book a shoot like this
                            <span aria-hidden>→</span>
                        </Link>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    );
}

function CloseButton({ onClose }) {
    return (
        <button type="button" onClick={onClose} data-autofocus className="chrome-link label flex items-center gap-2 text-text">
            Close <CloseIcon />
        </button>
    );
}
