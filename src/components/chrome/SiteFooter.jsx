export function SiteFooter({ email, socials }) {
    const instagram = socials.find((social) => social.label === "Instagram");
    return (
        <footer className="flex justify-between border-t border-line px-5 pb-8 pt-6 md:border-t-0 md:p-10">
            <span className="label text-[10px] leading-3 text-text-muted md:text-label md:leading-4">© ADQ Media</span>
            <span className="label text-text-muted max-md:hidden">Melbourne</span>
            <span className="label flex gap-1.5 text-[10px] leading-3 text-text-muted md:text-label md:leading-4">
                {instagram ? (
                    <>
                        <a href={instagram.url} target="_blank" rel="noreferrer" className="chrome-link hover:text-text">
                            Instagram
                        </a>
                        ·
                    </>
                ) : null}
                <a href={`mailto:${email}`} className="chrome-link hover:text-text">
                    Email
                </a>
            </span>
        </footer>
    );
}
