const CORNER = "absolute size-6 border-accent md:size-8";

/** Red viewfinder corners pinned to the edges of the screen. */
export function ScreenCorners() {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-2.5 z-40 opacity-80 md:inset-3.5">
            <span className={`${CORNER} left-0 top-0 border-l border-t`} />
            <span className={`${CORNER} right-0 top-0 border-r border-t`} />
            <span className={`${CORNER} bottom-0 left-0 border-b border-l`} />
            <span className={`${CORNER} bottom-0 right-0 border-b border-r`} />
        </div>
    );
}
