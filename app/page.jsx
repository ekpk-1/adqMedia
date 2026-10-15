import { Suspense } from "react";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { RoutedHomeIndex, StaticHomeIndex } from "@/components/home/HomeIndex";
import { getProjectSummaries, getSiteSettings } from "@/content/repository";

export default async function HomePage() {
    const settings = await getSiteSettings();
    const props = {
        projects: await getProjectSummaries(),
        reel: settings.showreel,
        footer: <SiteFooter email={settings.email} socials={settings.socials} />,
    };
    return (
        <Suspense fallback={<StaticHomeIndex {...props} />}>
            <RoutedHomeIndex {...props} />
        </Suspense>
    );
}
