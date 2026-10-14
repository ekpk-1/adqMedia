import { Suspense } from "react";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { RoutedHomeIndex, StaticHomeIndex } from "@/components/home/HomeIndex";
import { getProjectSummaries, getSiteSettings } from "@/content/repository";

export default function HomePage() {
    const settings = getSiteSettings();
    const props = {
        projects: getProjectSummaries(),
        reel: settings.showreel,
        footer: <SiteFooter email={settings.email} socials={settings.socials} />,
    };
    return (
        <Suspense fallback={<StaticHomeIndex {...props} />}>
            <RoutedHomeIndex {...props} />
        </Suspense>
    );
}
