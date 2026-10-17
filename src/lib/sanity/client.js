import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Server-only client. The token can read drafts and is never sent to the browser. */
export const previewClient = createClient({
    projectId,
    dataset,
    apiVersion: "2025-02-19",
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
});
