"use client";

import { useRef } from "react";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { filterProjects, formatDuration } from "@/lib/projects";
import { Carousel } from "./Carousel";
import { FilterToggle, ViewSwitch, useIndexParams } from "./IndexControls";
import { ProjectGrid } from "./ProjectGrid";
import { ReelIntro } from "./ReelIntro";

const STATIC_CONTROLS = { filter: "all", view: "grid", setFilter: () => {}, setView: () => {} };

/** Prerendered fallback: the full grid, before the URL's filter is known. */
export function StaticHomeIndex(props) {
    return <HomeIndex {...props} controls={STATIC_CONTROLS} />;
}

export function RoutedHomeIndex(props) {
    return <HomeIndex {...props} controls={useIndexParams()} />;
}

function HomeIndex({ projects, reel, footer, controls }) {
    const { filter, view, setFilter, setView } = controls;
    const visible = filterProjects(projects, filter);
    const pageRef = useRef(null);
    const slotRef = useRef(null);
    const filterToggle = <FilterToggle filter={filter} onChange={setFilter} />;

    if (view === "carousel") {
        return (
            <main>
                <SiteHeader center={filterToggle} />
                <div className="absolute right-5 top-[84px] z-30 md:right-10">
                    <ViewSwitch view={view} onChange={setView} />
                </div>
                <div className="absolute inset-x-5 top-[84px] z-30 md:hidden">
                    <FilterToggle filter={filter} onChange={setFilter} size="sm" />
                </div>
                <Carousel projects={visible} />
            </main>
        );
    }

    return (
        <main ref={pageRef} className="relative">
            <SiteHeader center={filterToggle} />
            <ReelIntro reel={reel} pageRef={pageRef} slotRef={slotRef} />

            <div
                className="flex flex-col gap-5 px-5 pb-[28px] pt-10 md:flex-row md:items-end md:justify-between md:px-10 md:pb-10 md:pt-24"
                style={{ opacity: "clamp(0, (var(--p, 1) - 0.7) * 3.4, 1)" }}
            >
                <div className="flex flex-col gap-2.5 md:gap-3">
                    <span className="label text-text-muted">
                        Index — {visible.length} {visible.length === 1 ? "project" : "projects"}
                    </span>
                    <h2 className="text-heading font-medium tracking-[-0.015em] text-text md:text-title">Selected work</h2>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-4 md:border-0 md:pb-2 md:pt-0">
                    <div className="md:hidden">
                        <FilterToggle filter={filter} onChange={setFilter} size="sm" />
                    </div>
                    <div className="max-md:hidden">
                        <ViewSwitch view={view} onChange={setView} />
                    </div>
                    <div className="md:hidden">
                        <ViewSwitch view={view} onChange={setView} size="sm" />
                    </div>
                </div>
            </div>

            <ProjectGrid
                projects={visible}
                reel={reel}
                reelSlotRef={slotRef}
                reelMeta={`Film · ${formatDuration(reel.duration)}`}
            />
            {footer}
        </main>
    );
}
