// Caps how many preview films play at once. Each claim is a tile that is on
// screen and wants to play; only those nearest the middle of the viewport get
// to, so a screenful of tiles doesn't download in parallel.

const claims = new Set();
let frame = 0;

export function playbackLimit(isMobile) {
    return isMobile ? 1 : 2;
}

/** The `limit` claims whose boxes sit closest to the viewport centre. */
export function pickNearest(entries, viewport, limit) {
    const cx = viewport.width / 2;
    const cy = viewport.height / 2;
    const distance = ({ box }) => Math.hypot(box.left + box.width / 2 - cx, box.top + box.height / 2 - cy);
    return new Set(
        [...entries]
            .sort((a, b) => distance(a) - distance(b))
            .slice(0, limit)
            .map((entry) => entry.claim)
    );
}

function rebalance() {
    frame = 0;
    const entries = [...claims].map((claim) => ({ claim, box: claim.node.getBoundingClientRect() }));
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const limit = playbackLimit(window.matchMedia("(max-width: 767px)").matches);
    const allowed = pickNearest(entries, viewport, limit);
    claims.forEach((claim) => claim.onChange(allowed.has(claim)));
}

function schedule() {
    if (!frame) frame = requestAnimationFrame(rebalance);
}

/** Asks to play `node`; `onChange(allowed)` fires whenever the answer changes. Returns a release function. */
export function claimPlayback(node, onChange) {
    const claim = { node, onChange };
    claims.add(claim);
    if (claims.size === 1) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
    }
    schedule();
    return () => {
        claims.delete(claim);
        onChange(false);
        if (!claims.size) {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        }
        schedule();
    };
}
