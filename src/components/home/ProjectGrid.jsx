"use client";

import { gridRows } from "@/lib/rows";
import { ProjectTile, TileCaption, tileClasses } from "./ProjectTile";

const pad = (n) => String(n).padStart(2, "0");

function mobileShape(index) {
    if (index === 0) return "lead";
    // After the lead tile: pair, full, pair, full…
    return (index - 1) % 3 === 2 ? "full" : "half";
}

/**
 * Cover grid. The first cell is reserved for the showreel; `reelSlotRef`
 * marks the box the intro reel lands in.
 */
export function ProjectGrid({ projects, reel, reelSlotRef, reelMeta }) {
    const tiles = [{ kind: "reel" }, ...projects.map((project) => ({ kind: "project", project }))];
    const desktopShapes = gridRows(tiles).flat().map((cell) => cell.shape);

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 px-5 pb-16 md:grid-cols-3 md:gap-x-6 md:gap-y-[72px] md:px-10 md:pb-[120px]">
            {tiles.map((tile, index) => {
                const number = pad(index + 1);
                if (tile.kind === "reel") {
                    const classes = tileClasses(desktopShapes[0], "lead");
                    return (
                        <div key="reel" className={`${classes.cell} flex flex-col gap-2.5 md:gap-[14px]`}>
                            <div ref={reelSlotRef} className={`${classes.media} relative w-full`} />
                            <TileCaption number={number} title={reel.title} meta={reelMeta} />
                        </div>
                    );
                }
                return (
                    <ProjectTile
                        key={tile.project.slug}
                        project={tile.project}
                        number={number}
                        desktopShape={desktopShapes[index]}
                        mobileShape={mobileShape(index)}
                    />
                );
            })}
        </div>
    );
}
