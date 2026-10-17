import localFont from "next/font/local";
import { Bebas_Neue } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { MenuOverlay } from "@/components/chrome/MenuOverlay";
import { ScreenCorners } from "@/components/chrome/ScreenCorners";
import { MenuProvider } from "@/components/providers/MenuProvider";
import { VideoModalProvider } from "@/components/providers/VideoModalProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { getProjects, getSiteSettings } from "@/content/repository";
import { bootScript } from "@/lib/theme";
import "lenis/dist/lenis.css";
import "./globals.css";

const satoshi = localFont({
    src: [
        { path: "../src/fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
        { path: "../src/fonts/Satoshi-Italic.woff2", weight: "400", style: "italic" },
        { path: "../src/fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    ],
    variable: "--font-satoshi",
    display: "swap",
});

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });

export const metadata = {
    metadataBase: new URL("https://adqmedia.au"),
    title: { default: "ADQ Media — Automotive photo and film, Melbourne", template: "%s — ADQ Media" },
    description:
        "Car photography and film by Alex Quach in Melbourne. Pre-sale photo sets for private sellers and social content for workshops and brands.",
    openGraph: { siteName: "ADQ Media", locale: "en_AU", type: "website" },
};

export const viewport = {
    themeColor: "#0f0f0f",
};

export default async function RootLayout({ children }) {
    const settings = await getSiteSettings();
    const { isEnabled: preview } = await draftMode();
    return (
        <html lang="en-AU" className={`${satoshi.variable} ${bebas.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: bootScript }} />
            </head>
            <body>
                <SmoothScroll />
                <MenuProvider>
                    <VideoModalProvider>
                        {children}
                        <ScreenCorners />
                        <MenuOverlay
                                projectCount={(await getProjects()).length}
                            email={settings.email}
                            socials={settings.socials}
                            reel={settings.showreel}
                        />
                    </VideoModalProvider>
                </MenuProvider>
                {preview ? <VisualEditing /> : null}
            </body>
        </html>
    );
}
