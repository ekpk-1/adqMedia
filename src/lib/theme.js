export const THEME_KEY = "adq:theme";
export const PROJECT_VIEW_KEY = "adq:project-view";
export const THEME_PREFERENCES = ["light", "dark", "system"];

/** A stored choice wins; otherwise the system setting decides. */
export function resolveTheme(stored, systemPrefersDark) {
    if (stored === "light" || stored === "dark") return stored;
    return systemPrefersDark ? "dark" : "light";
}

export function resolveProjectView(stored, isNarrowScreen) {
    if (stored === "layout" || stored === "scroll") return stored;
    return isNarrowScreen ? "scroll" : "layout";
}

/**
 * Runs inline in <head> before first paint so the page never flashes the
 * wrong theme or the wrong project view. Keep it dependency-free.
 */
export const bootScript = `(function(){try{
var d=document.documentElement,s=localStorage.getItem("${THEME_KEY}");
var dark=s==="dark"||(s!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);
d.classList.toggle("theme-light",!dark);
var v=localStorage.getItem("${PROJECT_VIEW_KEY}");
if(v!=="layout"&&v!=="scroll")v=matchMedia("(max-width: 767px)").matches?"scroll":"layout";
d.dataset.projectView=v;
}catch(e){}})();`;
