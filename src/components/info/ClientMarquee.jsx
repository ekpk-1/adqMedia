import Link from "next/link";

const WORDMARK = {
    "bebas-lg": "font-display text-[32px] leading-8 tracking-[0.02em] md:text-[40px] md:leading-10",
    bebas: "font-display text-[28px] leading-7 md:text-[34px] md:leading-[34px] md:tracking-[0.06em]",
    satoshi: "text-[24px] font-medium leading-7 tracking-[-0.03em] md:text-[30px] md:leading-8",
    italic: "text-[26px] italic leading-7 tracking-[-0.02em] md:text-[32px] md:leading-8",
    spaced: "text-[11px] font-medium uppercase leading-4 tracking-[0.28em] md:text-[13px]",
    stacked: "max-w-[8ch] text-center text-[20px] font-medium leading-[22px] tracking-[-0.02em] md:text-subhead md:leading-[26px]",
};

function ClientTile({ client, hidden }) {
    return (
        <Link
            href="/?filter=commercial"
            tabIndex={hidden ? -1 : undefined}
            aria-hidden={hidden || undefined}
            aria-label={hidden ? undefined : `${client.name}, view commercial work`}
            className="group/tile relative flex h-[104px] w-[190px] shrink-0 items-center justify-center border-r border-line text-text-muted transition-colors duration-200 hover:bg-surface hover:text-text focus-visible:bg-surface focus-visible:text-text md:h-[140px] md:w-[260px]"
        >
            <span className={WORDMARK[client.wordmark] ?? WORDMARK.satoshi}>{client.short ?? client.name}</span>
            <span className="label absolute bottom-3 left-4 text-text opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100">
                View work →
            </span>
        </Link>
    );
}

function Track({ clients, direction, className = "" }) {
    const animation = direction === "left" ? "marquee-left" : "marquee-right";
    // Repeat short rows so half the track always spans a wide viewport.
    const copies = clients.length >= 6 ? 2 : 4;
    const tiles = Array.from({ length: copies }, () => clients).flat();
    return (
        <div className={`flex overflow-hidden ${className}`}>
            <div
                className="flex w-max hover:[animation-play-state:paused]"
                style={{ animation: `${animation} ${tiles.length * 3}s linear infinite` }}
            >
                {tiles.map((client, index) => (
                    <ClientTile key={`${client.id}-${index}`} client={client} hidden={index >= clients.length} />
                ))}
            </div>
        </div>
    );
}

/** Two ruled rows of client wordmarks drifting in opposite directions. */
export function ClientMarquee({ clients }) {
    const half = Math.ceil(clients.length / 2);
    return (
        <div className="relative border-y border-line">
            <Track clients={clients.slice(0, half)} direction="left" className="border-b border-line" />
            <Track clients={clients.slice(half)} direction="right" />
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent md:w-40" />
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent md:w-40" />
        </div>
    );
}
