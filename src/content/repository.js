// Pages only talk to these functions. With Sanity configured and at least one
// project published, that is the source. Otherwise the files in this folder are.
import { draftMode } from "next/headers";
import { cache } from "react";
import { fetchSanityContent, sanityConfigured } from "@/lib/sanity/content";
import { summariseProject } from "./assemble";
import * as local from "./local";

async function draftsOpen() {
    try {
        return (await draftMode()).isEnabled;
    } catch {
        return false;
    }
}

const loadRemote = cache(async () => {
    if (!sanityConfigured()) return null;
    const drafts = await draftsOpen();
    try {
        const remote = await fetchSanityContent({ drafts });
        if (!remote.projects.length && !drafts) {
            console.warn("[content] Sanity has no projects yet. Serving the files in the repo.");
            return null;
        }
        return remote;
    } catch (error) {
        console.error("[content] Sanity request failed", error);
        if (process.env.NODE_ENV === "production") throw error;
        return null;
    }
});

export const getProjects = cache(async () => (await loadRemote())?.projects ?? local.getProjects());

export const getProject = cache(async (slug) => (await getProjects()).find((project) => project.slug === slug) ?? null);

export const getProjectSummaries = cache(async () => (await getProjects()).map(summariseProject));

export const getClients = cache(async () => {
    const remote = await loadRemote();
    return remote?.clients?.length ? remote.clients : local.getClients();
});

export const getSiteSettings = cache(async () => {
    const remote = await loadRemote();
    const fileSettings = local.getSiteSettings();
    const settings = remote?.settings;
    if (!settings) return fileSettings;
    return {
        ...fileSettings,
        ...settings,
        showreel: settings.showreel?.src ? settings.showreel : fileSettings.showreel,
        info: {
            ...fileSettings.info,
            ...settings.info,
            still: settings.info?.still?.src ? settings.info.still : fileSettings.info.still,
        },
        services: settings.services?.some((service) => service.image) ? settings.services : fileSettings.services,
    };
});
