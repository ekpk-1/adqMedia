import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { previewDocuments, previewLocations } from "./cms/preview";
import { schemaTypes } from "./cms/schema";
import { structure } from "./cms/desk";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
    name: "adq-media",
    title: "ADQ Media",
    basePath: "/studio",
    projectId,
    dataset,
    plugins: [
        structureTool({ structure }),
        presentationTool({
            previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
            resolve: { locations: previewLocations, mainDocuments: previewDocuments },
        }),
    ],
    schema: { types: schemaTypes },
});
