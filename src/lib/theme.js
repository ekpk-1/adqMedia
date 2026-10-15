export const PROJECT_VIEW_KEY = "adq:project-view";

export function resolveProjectView(stored, isNarrowScreen) {
    if (stored === "layout" || stored === "scroll") return stored;
    return isNarrowScreen ? "scroll" : "layout";
}

/**
 * Runs inline in <head> before first paint so the project page never flashes
 * the wrong view. Keep it dependency-free.
 */
export const bootScript = `(function(){try{
var d=document.documentElement,v=localStorage.getItem("${PROJECT_VIEW_KEY}");
if(v!=="layout"&&v!=="scroll")v=matchMedia("(max-width: 767px)").matches?"scroll":"layout";
d.dataset.projectView=v;
}catch(e){}})();`;
