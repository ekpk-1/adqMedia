import { SiteHeader } from "@/components/chrome/SiteHeader";
import {
    AboutSection,
    ClientsSection,
    ContactBand,
    InfoHero,
    InfoStill,
    ServicesSection,
} from "@/components/info/InfoSections";
import { getClients, getProjectSummaries, getSiteSettings } from "@/content/repository";
import { SERVICE_CHOICES } from "@/content/settings";

export const metadata = {
    title: "Info",
    description:
        "ADQ Media is Alex Quach, a Melbourne car photographer and videographer. Pre-sale photography for private sellers and social content for workshops and brands.",
    alternates: { canonical: "/info" },
};

export default function InfoPage() {
    const settings = getSiteSettings();
    const { info } = settings;
    const projectTitles = Object.fromEntries(getProjectSummaries().map((project) => [project.slug, project.title]));

    return (
        <main id="top" className="relative">
            <SiteHeader />
            <InfoHero statement={info.statement} facts={info.facts} />
            <InfoStill still={info.still} />
            <AboutSection lead={info.aboutLead} body={info.aboutBody} />
            <ServicesSection services={settings.services} />
            <ClientsSection clients={getClients()} />
            <ContactBand
                intro={info.contactIntro}
                email={settings.email}
                phone={settings.phone}
                socials={settings.socials}
                location={settings.location}
                services={SERVICE_CHOICES}
                projectTitles={projectTitles}
            />
        </main>
    );
}
