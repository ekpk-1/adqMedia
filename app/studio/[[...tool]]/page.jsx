import { Studio } from "./Studio";

export const dynamic = "force-dynamic";

export const viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export const metadata = {
    title: "Studio",
    robots: { index: false, follow: false },
};

export default function StudioPage() {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    if (!projectId || !dataset) {
        return (
            <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-4 px-6">
                <h1 className="text-heading">Studio needs a Sanity project</h1>
                <p className="text-body text-text-muted">
                    Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET, then rebuild. Alex signs in with the Sanity account that owns the project.
                </p>
            </main>
        );
    }

    return <Studio />;
}
