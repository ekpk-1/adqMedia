import { mapContent } from "./map";
import { CONTENT_QUERY } from "./query";

export const CONTENT_TAG = "content";
const API_VERSION = "2025-02-19";

export function sanityConfigured() {
    return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);
}

export async function fetchSanityContent() {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
    const url = `https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(CONTENT_QUERY)}`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(url, { headers, next: { tags: [CONTENT_TAG], revalidate: false } });
    if (!response.ok) throw new Error(`Sanity responded ${response.status}`);
    const body = await response.json();
    return mapContent(body.result);
}
