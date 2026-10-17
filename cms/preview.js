import { defineDocuments, defineLocations } from "sanity/presentation";

export const previewLocations = {
    project: defineLocations({
        select: { title: "title", slug: "slug.current" },
        resolve: (doc) => ({
            locations: [
                { title: doc?.title || "Untitled", href: doc?.slug ? `/work/${doc.slug}` : "/" },
                { title: "All work", href: "/" },
            ],
        }),
    }),
    siteSettings: defineLocations({
        select: { email: "email" },
        resolve: () => ({
            locations: [
                { title: "Home", href: "/" },
                { title: "Info", href: "/info" },
            ],
        }),
    }),
};

export const previewDocuments = defineDocuments([
    {
        route: "/work/:slug",
        filter: `_type == "project" && slug.current == $slug`,
        params: ({ params }) => ({ slug: params.slug }),
    },
    {
        route: "/info",
        filter: `_id == "siteSettings"`,
    },
]);
