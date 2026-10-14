import Link from "next/link";

export function Wordmark({ size = "md", href = "/", onClick }) {
    const large = size === "lg";
    return (
        <Link
            href={href}
            onClick={onClick}
            aria-label="ADQ Media, all work"
            className="chrome-link relative inline-flex shrink-0 pr-3 font-display text-text"
        >
            <span
                className={
                    large
                        ? "text-[48px] leading-[48px]"
                        : "text-[30px] leading-8 md:text-[36px] md:leading-10"
                }
            >
                ADQ
            </span>
            <span
                aria-hidden
                className={
                    large
                        ? "absolute right-0 top-1 size-[9px] rounded-full bg-accent"
                        : "absolute left-[43px] top-[3px] size-[6px] rounded-full bg-accent md:left-[52px] md:top-1 md:size-[7px]"
                }
            />
        </Link>
    );
}
