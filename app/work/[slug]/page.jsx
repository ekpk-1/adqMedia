import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ProjectView } from "@/components/project/ProjectView";
import { getProject, getProjectSummaries, getProjects, getSiteSettings } from "@/content/repository";
import { getNeighbours } from "@/lib/projects";

export const dynamicParams = true;

export async function generateStaticParams() {
    return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) return {};
    const description =
        project.info?.lead ??
        `${project.title}: ${project.contents}. ${project.category === "commercial" ? `Commercial work for ${project.client.name}` : "Creative work"} by ADQ Media, Melbourne.`;
    return {
        title: project.title,
        description,
        alternates: { canonical: `/work/${project.slug}` },
        openGraph: {
            title: `${project.title} — ADQ Media`,
            description,
            images: project.cover ? [{ url: project.cover.src, width: project.cover.width, height: project.cover.height }] : [],
        },
    };
}

export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) notFound();
    const settings = await getSiteSettings();
    const neighbours = getNeighbours(await getProjectSummaries(), slug);

    return (
        <ProjectView
            project={project}
            neighbours={neighbours}
            footer={<SiteFooter email={settings.email} socials={settings.socials} />}
        />
    );
}
