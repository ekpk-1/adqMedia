import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/sanity/content";
import { secretMatches, slugFromWebhook } from "@/lib/revalidate";

export async function POST(request) {
    const provided = request.headers.get("x-sanity-secret");
    if (!secretMatches(provided, process.env.SANITY_REVALIDATE_SECRET)) {
        return Response.json({ ok: false }, { status: 401 });
    }

    let body = {};
    try {
        body = await request.json();
    } catch {
        body = {};
    }

    revalidateTag(CONTENT_TAG, "max");
    revalidatePath("/", "layout");
    const slug = slugFromWebhook(body);
    if (slug) revalidatePath(`/work/${slug}`);

    return Response.json({ ok: true, slug });
}
