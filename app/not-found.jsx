"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/chrome/SiteHeader";

const CORNER = "absolute size-6 border-accent md:size-9";

export default function NotFound() {
    const pathname = usePathname();

    return (
        <main className="relative flex h-svh flex-col">
            <title>Page not found — ADQ Media</title>
            <SiteHeader position="static" />
            <div className="relative mx-5 mb-5 flex flex-1 items-center justify-center overflow-hidden bg-surface md:mx-10 md:mb-10">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:33.333%_33.333%]"
                />
                <span aria-hidden className={`${CORNER} left-4 top-4 border-l-2 border-t-2`} />
                <span aria-hidden className={`${CORNER} right-4 top-4 border-r-2 border-t-2`} />
                <span aria-hidden className={`${CORNER} bottom-4 left-4 border-b-2 border-l-2`} />
                <span aria-hidden className={`${CORNER} bottom-4 right-4 border-b-2 border-r-2`} />

                <div className="label absolute left-8 top-8 flex items-center gap-2 text-text md:left-14 md:top-14">
                    <span aria-hidden className="size-2 rounded-full bg-accent-hover motion-safe:animate-[blink_1.2s_steps(1)_infinite]" />
                    No signal
                </div>
                <div className="label absolute right-8 top-8 flex gap-4 text-text-muted md:right-14 md:top-14">
                    <span className="max-md:hidden">Standby</span>
                    <span className="tabular-nums text-text">00:00:00:00</span>
                </div>
                <div className="label absolute bottom-8 left-8 max-w-[60%] truncate text-text-muted md:bottom-14 md:left-14">
                    Lost frame · <span className="text-text">{pathname}</span>
                </div>
                <div className="label absolute bottom-8 right-8 text-text-muted md:bottom-14 md:right-14">Err 404</div>

                <div className="relative flex flex-col items-center gap-8 md:gap-10">
                    <h1 className="font-display text-[160px] leading-[140px] text-text md:text-[300px] md:leading-[250px]">
                        <span className="sr-only">Page not found, error </span>404
                    </h1>
                    <Link href="/" className="btn btn-primary viewfinder vf-on">
                        <span aria-hidden>←</span>
                        Back to all work
                    </Link>
                </div>
            </div>
        </main>
    );
}
