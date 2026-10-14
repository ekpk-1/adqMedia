let instance = null;
let locks = 0;

export function setLenis(lenis) {
    instance = lenis;
    if (lenis && locks > 0) lenis.stop();
}

/** Scrolls the page, going through Lenis when it is running so its position stays in sync. */
export function scrollToTop() {
    if (instance) instance.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0 });
}

/** Pauses smooth scrolling while an overlay is open. Overlays can stack, so locks are counted. */
export function lockScroll() {
    locks += 1;
    instance?.stop();
    return () => {
        locks = Math.max(0, locks - 1);
        if (locks === 0) instance?.start();
    };
}
