import { mapContent } from "./map";
import { CONTENT_QUERY } from "./query";

export const CONTENT_TAG = "content";
const API_VERSION = "2025-02-19";

export function sanityConfigured() {
    return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);
}

/** Published content by default. Draft preview asks for the draft perspective. */
export function contentRequest(projectId, dataset, drafts) {
    const url = new URL(`https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}`);
    url.searchParams.set("query", CONTENT_QUERY);
    if (drafts) url.searchParams.set("perspective", "previewDrafts");
    return url;
}

export async function fetchSanityContent({ drafts = false } = {}) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
    if (drafts && !token) throw new Error("Set SANITY_API_READ_TOKEN to preview drafts.");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(contentRequest(projectId, dataset, drafts), {
        headers,
        ...(drafts ? { cache: "no-store" } : { next: { tags: [CONTENT_TAG], revalidate: false } }),
    });
    if (!response.ok) throw new Error(`Sanity responded ${response.status}`);
    const body = await response.json();
    return mapContent(body.result, { includeEmpty: drafts });
}
