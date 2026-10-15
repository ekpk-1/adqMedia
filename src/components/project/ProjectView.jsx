"use client";

import { useCallback, useState } from "react";
import { MenuButton, PlusIcon, SiteHeader } from "@/components/chrome/SiteHeader";
import { useProjectView } from "@/hooks/useProjectView";
import { scrollToTop } from "@/lib/smoothScroll";
import { InfoPanel } from "./InfoPanel";
import { LayoutView } from "./LayoutView";
import { ScrollView } from "./ScrollView";
import { ViewToggle } from "./ViewToggle";

export function ProjectView({ project, neighbours, footer }) {
    const [view, setView] = useProjectView();
    const [infoOpen, setInfoOpen] = useState(false);
    const openInfo = useCallback(() => setInfoOpen(true), []);
    const closeInfo = useCallback(() => setInfoOpen(false), []);

    const changeView = (next) => {
        setView(next);
        scrollToTop();
    };

    const actions = (
        <>
            <button
                type="button"
                onClick={openInfo}
                aria-haspopup="dialog"
                className={`chrome-link label flex items-center gap-2 text-text ${view === "scroll" ? "max-md:hidden" : ""}`}
            >
                Info <PlusIcon />
            </button>
            <MenuButton />
        </>
    );

    return (
        <main className={view === "scroll" ? "h-svh overflow-hidden" : "relative"}>
            <SiteHeader
                center={<ViewToggle view={view} onChange={changeView} />}
                centerOnMobile
                actions={actions}
            />
            {view === "scroll" ? (
                <ScrollView project={project} onOpenInfo={openInfo} />
            ) : (
                <LayoutView project={project} neighbours={neighbours} onOpenInfo={openInfo} footer={footer} />
            )}
            <InfoPanel project={project} isOpen={infoOpen} onClose={closeInfo} />
        </main>
    );
}
