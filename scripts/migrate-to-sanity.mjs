// Uploads photos to Sanity and writes each film as a path into public/.
// Safe to re-run: finished photos are remembered in scripts/.sanity-migrate-cache.json.
// Films stay in the gallery. This script does not delete anything from the repo.
import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { clients } from "../src/content/clients.js";
import manifest from "../src/content/media-manifest.json" with { type: "json" };
import { collectAssetPaths, planProject } from "../src/content/migrationPlan.js";
import { POSTERS } from "../src/content/posters.js";
import { projectDocuments } from "../src/content/projects.js";
import { settings } from "../src/content/settings.js";
import { autoRows } from "../src/lib/rows.js";

const CACHE_PATH = path.join("scripts", ".sanity-migrate-cache.json");

function loadEnvFile(file) {
    if (!existsSync(file)) return;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const eq = trimmed.indexOf("=");
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
    }
}

function diskPath(publicPath) {
    return path.join(process.cwd(), "public", ...decodeURI(publicPath).replace(/^\/+/, "").split("/"));
}

function filmFromPath(file, poster) {
    if (!file) return undefined;
    const meta = manifest[file] ?? {};
    return {
        src: file,
        poster: poster ?? POSTERS[file],
        width: meta.width,
        height: meta.height,
        duration: meta.duration,
    };
}

function keyFor(value) {
    return createHash("sha1").update(value).digest("hex").slice(0, 12);
}

function readCache() {
    if (!existsSync(CACHE_PATH)) return { images: {} };
    const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8"));
    return { images: cache.images ?? {} };
}

function writeCache(cache) {
    mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

async function mutateAll(client, mutations) {
    for (let index = 0; index < mutations.length; index += 40) {
        await client.mutate(mutations.slice(index, index + 40));
    }
}

async function uploadImage(client, file, cache) {
    if (cache.images[file]) return cache.images[file];
    const absolute = diskPath(file);
    if (!existsSync(absolute)) throw new Error(`Missing photo: ${absolute}`);
    const asset = await client.assets.upload("image", createReadStream(absolute), { filename: path.basename(absolute) });
    cache.images[file] = asset._id;
    writeCache(cache);
    return asset._id;
}

function imageRef(assetId, alt) {
    if (!assetId) return undefined;
    return { _type: "image", alt: alt ?? "", asset: { _type: "reference", _ref: assetId } };
}

function stillImage(assetId, caption) {
    const image = imageRef(assetId, caption);
    return image ? { ...image, caption } : undefined;
}

function layoutRows(plan) {
    if (plan.rows.length === 1 && plan.rows[0].type === "auto") {
        const items = plan.rows[0].slots.map((item) => ({ ...item, type: item.kind === "video" ? "video" : "image" }));
        return autoRows(items).map((row) => ({ type: row.type, slots: row.slots }));
    }
    return plan.rows;
}

function requireEnv(name) {
    if (!process.env[name]) throw new Error(`Set ${name} before running the migration.`);
    return process.env[name];
}

async function main() {
    loadEnvFile(".env");
    loadEnvFile(".env.local");
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";
    if (!projectId) throw new Error("Set NEXT_PUBLIC_SANITY_PROJECT_ID before running the migration.");
    const token = requireEnv("SANITY_API_WRITE_TOKEN");

    const client = createClient({ projectId, dataset, token, apiVersion: "2025-02-19", useCdn: false });
    const cache = readCache();
    const plans = projectDocuments.map((doc) => planProject(doc, manifest)).filter((plan) => plan.rows.length);
    const assets = collectAssetPaths(plans, settings, manifest);

    for (const file of assets.videos) {
        if (!existsSync(diskPath(file))) throw new Error(`Missing film: ${diskPath(file)}`);
    }
    console.log(`${assets.videos.length} films stay in the gallery`);

    let photos = 0;
    for (const file of assets.images) {
        await uploadImage(client, file, cache);
        photos += 1;
        if (photos % 25 === 0) console.log(`uploaded ${photos} of ${assets.images.length} photos`);
    }
    console.log(`photos done (${assets.images.length})`);

    const clientDocs = clients.map((clientDoc) => ({
        _id: `client.${clientDoc.id}`,
        _type: "client",
        name: clientDoc.name,
        slug: { _type: "slug", current: clientDoc.id },
        short: clientDoc.short,
        wordmark: clientDoc.wordmark,
    }));

    const projectDocs = projectDocuments.map((doc, index) => {
        const plan = plans.find((item) => item.slug === doc.slug);
        if (!plan) return null;
        return {
            _id: `project.${doc.slug}`,
            _type: "project",
            title: doc.title,
            slug: { _type: "slug", current: doc.slug },
            order: index,
            category: doc.category,
            location: doc.location,
            date: doc.date,
            client: { _type: "reference", _ref: `client.${doc.client || "private"}` },
            info: doc.info,
            credits: (doc.credits ?? []).map((credit) => ({ _key: keyFor(`${credit.role}-${credit.name}`), _type: "object", ...credit })),
            cover: imageRef(cache.images[plan.cover], `${doc.title}, cover`),
            coverVideo: filmFromPath(plan.coverVideo),
            rows: layoutRows(plan).map((row, rowIndex) => ({
                _key: keyFor(`${doc.slug}-row-${rowIndex}`),
                _type: "row",
                type: row.type,
                slots: row.slots.map((item, slotIndex) => ({
                    _key: keyFor(`${doc.slug}-${rowIndex}-${slotIndex}-${item.path}`),
                    _type: "slot",
                    kind: item.kind,
                    alt: item.alt,
                    width: item.width,
                    height: item.height,
                    duration: item.duration,
                    image: item.kind === "image" ? imageRef(cache.images[item.path], item.alt) : undefined,
                    ...(item.kind === "video" ? filmFromPath(item.path) : {}),
                })),
            })),
        };
    }).filter(Boolean);

    const settingsDoc = {
        _id: "siteSettings",
        _type: "siteSettings",
        email: settings.email,
        phone: settings.phone,
        location: settings.location,
        socials: settings.socials.map((social) => ({ _key: keyFor(social.url), _type: "object", ...social })),
        showreel: {
            title: settings.showreel.title,
            caption: settings.showreel.caption,
            ...filmFromPath(settings.showreel.src, settings.showreel.poster),
        },
        info: {
            statement: settings.info.statement,
            facts: settings.info.facts.map((fact) => ({ _key: keyFor(fact.label), _type: "object", ...fact })),
            aboutLead: settings.info.aboutLead,
            aboutBody: settings.info.aboutBody,
            contactIntro: settings.info.contactIntro,
            still: stillImage(cache.images[settings.info.still.src], settings.info.still.caption),
        },
        services: settings.services.map((service) => ({
            _key: keyFor(service.id),
            _type: "object",
            id: service.id,
            audience: service.audience,
            title: service.title,
            chip: service.chip,
            pitch: service.pitch,
            youGet: service.youGet,
            where: service.where,
            image: imageRef(cache.images[service.image], `${service.title}, example shot`),
        })),
    };

    await mutateAll(client, [
        ...clientDocs.map((doc) => ({ createOrReplace: doc })),
        ...projectDocs.map((doc) => ({ createOrReplace: doc })),
        { createOrReplace: settingsDoc },
    ]);

    console.log(`Wrote ${clientDocs.length} clients, ${projectDocs.length} projects and the site settings.`);
    console.log("Films stay in public/. Leave them there. The site plays those files.");
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
