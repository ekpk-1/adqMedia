import { defineArrayMember, defineField, defineType } from "sanity";

const wordmarks = [
    { title: "Bebas, large", value: "bebas-lg" },
    { title: "Bebas", value: "bebas" },
    { title: "Satoshi", value: "satoshi" },
    { title: "Italic", value: "italic" },
    { title: "Spaced", value: "spaced" },
    { title: "Stacked", value: "stacked" },
];

const imageField = (name, title) =>
    defineField({
        name,
        title,
        type: "image",
        options: { hotspot: true },
        fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    });

const slot = defineType({
    name: "slot",
    title: "Slot",
    type: "object",
    fields: [
        defineField({
            name: "kind",
            title: "Kind",
            type: "string",
            options: {
                list: [
                    { title: "Photo", value: "image" },
                    { title: "Film", value: "video" },
                ],
                layout: "radio",
            },
            initialValue: "image",
            validation: (rule) => rule.required(),
        }),
        imageField("image", "Photo"),
        defineField({
            name: "src",
            title: "Film file",
            type: "string",
            description: "Path on the site, such as /gallery/videos/Rush_s-M3.webm. The file stays in public/.",
            validation: (rule) => rule.custom((value) => !value || value.startsWith("/") || "Start the path with /"),
        }),
        defineField({
            name: "poster",
            title: "Poster",
            type: "string",
            description: "Still shown before the film plays, such as /posters/Rush-s-M3.jpg.",
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
        defineField({ name: "width", title: "Width", type: "number", description: "Pixels. Films default to 1080 if this is empty." }),
        defineField({ name: "height", title: "Height", type: "number", description: "Pixels. Films default to 1920 if this is empty." }),
        defineField({ name: "duration", title: "Duration", type: "number", description: "Seconds." }),
    ],
    preview: {
        select: { kind: "kind", alt: "alt", media: "image" },
        prepare({ kind, alt, media }) {
            return { title: alt || (kind === "video" ? "Film" : "Photo"), media };
        },
    },
});

const row = defineType({
    name: "row",
    title: "Row",
    type: "object",
    fields: [
        defineField({
            name: "type",
            title: "Layout",
            type: "string",
            options: {
                list: [
                    { title: "Full", value: "full" },
                    { title: "Pair", value: "pair" },
                    { title: "Trio", value: "trio" },
                    { title: "Text and photo", value: "text" },
                ],
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "slots",
            title: "Slots",
            type: "array",
            of: [defineArrayMember({ type: "slot" })],
            validation: (rule) => rule.required().min(1).max(3),
        }),
    ],
    preview: {
        select: { type: "type", slots: "slots" },
        prepare({ type, slots }) {
            return { title: type, subtitle: `${slots?.length ?? 0} slots` };
        },
    },
});

const client = defineType({
    name: "client",
    title: "Client",
    type: "document",
    fields: [
        defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (rule) => rule.required() }),
        defineField({ name: "short", title: "Short name", type: "string", description: "Shown on the client marquee when the full name is too long." }),
        defineField({ name: "wordmark", title: "Wordmark", type: "string", options: { list: wordmarks } }),
        defineField({ name: "url", title: "Website", type: "url" }),
        imageField("logo", "Logo"),
    ],
    preview: { select: { title: "name", media: "logo" } },
});

const project = defineType({
    name: "project",
    title: "Project",
    type: "document",
    fields: [
        defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
        defineField({ name: "order", title: "Order", type: "number", description: "Lower numbers appear first on the homepage." }),
        defineField({
            name: "category",
            title: "Category",
            type: "string",
            options: {
                list: [
                    { title: "Creative", value: "creative" },
                    { title: "Commercial", value: "commercial" },
                ],
                layout: "radio",
            },
            validation: (rule) => rule.required(),
        }),
        defineField({ name: "client", title: "Client", type: "reference", to: [{ type: "client" }] }),
        defineField({ name: "date", title: "Date", type: "date" }),
        defineField({ name: "location", title: "Location", type: "string" }),
        imageField("cover", "Cover"),
        defineField({
            name: "coverVideo",
            title: "Cover film",
            type: "object",
            description: "Plays on the homepage tile. Leave the file empty to use the first film in the rows.",
            fields: [
                defineField({
                    name: "src",
                    title: "Film file",
                    type: "string",
                    description: "Path on the site, such as /gallery/videos/Rush_s-M3.webm.",
                }),
                defineField({ name: "poster", title: "Poster", type: "string" }),
                defineField({ name: "width", title: "Width", type: "number" }),
                defineField({ name: "height", title: "Height", type: "number" }),
                defineField({ name: "duration", title: "Duration", type: "number" }),
            ],
        }),
        defineField({
            name: "info",
            title: "Info",
            type: "object",
            fields: [
                defineField({ name: "lead", title: "Lead", type: "text", rows: 3 }),
                defineField({ name: "body", title: "Body", type: "text", rows: 6 }),
            ],
        }),
        defineField({
            name: "credits",
            title: "Credits",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({ name: "role", title: "Role", type: "string" }),
                        defineField({ name: "name", title: "Name", type: "string" }),
                    ],
                    preview: { select: { title: "name", subtitle: "role" } },
                }),
            ],
        }),
        defineField({
            name: "rows",
            title: "Rows",
            type: "array",
            of: [defineArrayMember({ type: "row" })],
            validation: (rule) => rule.required().min(1),
        }),
    ],
    orderings: [{ title: "Manual order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
    preview: {
        select: { title: "title", subtitle: "category", media: "cover" },
    },
});

const siteSettings = defineType({
    name: "siteSettings",
    title: "Site settings",
    type: "document",
    fields: [
        defineField({ name: "email", title: "Email", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "location", title: "Location", type: "string" }),
        defineField({
            name: "socials",
            title: "Socials",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({ name: "label", title: "Label", type: "string" }),
                        defineField({ name: "url", title: "URL", type: "url" }),
                    ],
                }),
            ],
        }),
        defineField({
            name: "showreel",
            title: "Showreel",
            type: "object",
            fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "caption", title: "Caption", type: "string" }),
                defineField({ name: "src", title: "Film file", type: "string", description: "Path on the site, such as /reel/showreel.mp4." }),
                defineField({ name: "poster", title: "Poster", type: "string" }),
                defineField({ name: "width", title: "Width", type: "number" }),
                defineField({ name: "height", title: "Height", type: "number" }),
                defineField({ name: "duration", title: "Duration", type: "number" }),
            ],
        }),
        defineField({
            name: "info",
            title: "Info page",
            type: "object",
            fields: [
                defineField({ name: "statement", title: "Statement", type: "text", rows: 3 }),
                defineField({
                    name: "facts",
                    title: "Facts",
                    type: "array",
                    of: [
                        defineArrayMember({
                            type: "object",
                            fields: [
                                defineField({ name: "value", title: "Value", type: "string" }),
                                defineField({ name: "label", title: "Label", type: "string" }),
                            ],
                        }),
                    ],
                }),
                defineField({
                    name: "still",
                    title: "Still",
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        defineField({ name: "alt", title: "Alt text", type: "string" }),
                        defineField({ name: "caption", title: "Caption", type: "string" }),
                    ],
                }),
                defineField({ name: "aboutLead", title: "About lead", type: "text", rows: 4 }),
                defineField({ name: "aboutBody", title: "About body", type: "array", of: [defineArrayMember({ type: "text" })] }),
                defineField({ name: "contactIntro", title: "Contact intro", type: "text", rows: 3 }),
            ],
        }),
        defineField({
            name: "services",
            title: "Services",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({ name: "id", title: "Id", type: "string", description: "pre-sale or social. The contact form knows these two." }),
                        defineField({ name: "audience", title: "Audience", type: "string" }),
                        defineField({ name: "title", title: "Title", type: "string" }),
                        defineField({ name: "chip", title: "Form chip", type: "string" }),
                        defineField({ name: "pitch", title: "Pitch", type: "text", rows: 3 }),
                        defineField({ name: "youGet", title: "You get", type: "string" }),
                        defineField({ name: "where", title: "Where", type: "string" }),
                        imageField("image", "Image"),
                    ],
                }),
            ],
        }),
    ],
});

export const schemaTypes = [slot, row, client, project, siteSettings];
