import { Wordmark } from "@/components/chrome/Wordmark";
import { Photo } from "@/components/media/Photo";
import { ClientMarquee } from "./ClientMarquee";
import { ContactForm } from "./ContactForm";

const TITLE = "text-[40px] font-medium leading-[44px] tracking-[-0.03em] md:text-title";

export function InfoHero({ statement, facts }) {
    return (
        <section className="flex flex-col gap-10 px-5 pb-16 pt-[104px] md:gap-16 md:px-10 md:pb-24 md:pt-[120px]">
            <span className="label text-text-muted">Info</span>
            <h1 className="max-w-[1180px] text-[44px] font-medium leading-[46px] tracking-[-0.04em] md:text-[clamp(56px,6.7vw,96px)] md:leading-[1]">
                {statement}
            </h1>
            <dl className="grid grid-cols-2 gap-x-5 gap-y-7 border-t border-line pt-5 md:flex md:gap-0">
                {facts.map((fact) => (
                    <div key={fact.label} className="flex flex-col-reverse justify-end gap-1.5 md:w-[340px] md:last:w-auto">
                        <dt className="label text-text-muted">{fact.label}</dt>
                        <dd className="text-[26px] font-medium leading-8 tracking-[-0.02em] md:text-heading">{fact.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

export function InfoStill({ still }) {
    return (
        <figure className="tone-dark relative h-[420px] overflow-hidden bg-background md:h-[720px]">
            <Photo media={still} sizes="100vw" priority className="absolute inset-0" />
            <figcaption className="label absolute bottom-5 left-5 text-text md:bottom-6 md:left-10">{still.caption}</figcaption>
        </figure>
    );
}

function SectionLabel({ number, label, accent = false }) {
    return (
        <div className="label flex gap-6 md:w-[30%] xl:w-[460px] md:shrink-0">
            <span className={accent ? "text-accent" : "text-text-muted"}>{number}</span>
            <span className="text-text">{label}</span>
        </div>
    );
}

export function AboutSection({ lead, body }) {
    return (
        <section id="about" className="flex flex-col gap-8 px-5 py-20 md:flex-row md:gap-0 md:px-10 md:py-[144px]">
            <SectionLabel number="01" label="About" />
            <div className="flex max-w-[900px] flex-1 flex-col gap-10 md:gap-14">
                <p className="text-[26px] font-medium leading-[34px] tracking-[-0.02em] md:text-[36px] md:leading-[44px]">{lead}</p>
                <div className="flex flex-col gap-6 md:flex-row md:gap-10">
                    {body.map((paragraph) => (
                        <p key={paragraph.slice(0, 24)} className="text-body md:w-[430px] md:leading-[26px]">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ServicesSection({ services }) {
    return (
        <section id="services" className="flex scroll-mt-6 flex-col px-5 pb-20 md:px-10 md:pb-[144px]">
            <div className="flex flex-col gap-8 pb-10 md:flex-row md:gap-0 md:pb-14">
                <SectionLabel number="02" label="Services" />
                <h2 className={TITLE}>Two ways to book.</h2>
            </div>
            {services.map((service) => (
                <article key={service.id} className="flex flex-col gap-6 border-t border-line pb-12 pt-8 last:border-b md:flex-row md:gap-0 md:pb-14">
                    <div className="flex flex-col gap-2 md:w-[30%] xl:w-[460px] md:shrink-0">
                        <span className="label text-text-muted">{service.audience}</span>
                        <h3 className="text-[28px] font-medium leading-9 tracking-[-0.02em] md:text-heading">{service.title}</h3>
                    </div>
                    <div className="flex max-w-[900px] flex-1 flex-col gap-8 lg:flex-row lg:gap-10">
                        <div className="flex flex-col gap-8 lg:w-[430px] lg:shrink-0">
                            <p className="text-body md:leading-[26px]">{service.pitch}</p>
                            <dl className="flex flex-col border-t border-line">
                                {[
                                    ["You get", service.youGet],
                                    ["Where", service.where],
                                ].map(([term, value]) => (
                                    <div key={term} className="flex border-b border-line py-3">
                                        <dt className="label w-[120px] shrink-0 leading-6 text-text-muted md:w-[140px]">{term}</dt>
                                        <dd className="text-body">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        {service.image ? (
                            <div className="relative aspect-[430/320] w-full overflow-hidden bg-surface lg:w-[430px] lg:shrink">
                                <Photo media={service.image} sizes="(max-width: 1023px) 100vw, 430px" className="absolute inset-0" />
                            </div>
                        ) : null}
                    </div>
                </article>
            ))}
        </section>
    );
}

export function ClientsSection({ clients }) {
    return (
        <section id="clients" className="flex flex-col pb-20 md:pb-[144px]">
            <div className="flex flex-col gap-8 px-5 pb-10 md:flex-row md:gap-0 md:px-10 md:pb-14">
                <SectionLabel number="03" label="Clients" />
                <div className="flex max-w-[900px] flex-1 items-end justify-between gap-6">
                    <h2 className={TITLE}>Who we&apos;ve shot for.</h2>
                    <span className="label shrink-0 text-text-muted">{clients.length} clients</span>
                </div>
            </div>
            <ClientMarquee clients={clients} />
        </section>
    );
}

const handleFor = (social) => {
    const handle = social.url.replace(/\/+$/, "").split("/").pop();
    return `${social.label} @${handle}`;
};

export function ContactBand({ intro, email, phone, socials, location, services, projectTitles }) {
    return (
        <section id="contact" className="tone-invert flex flex-col gap-14 bg-background px-5 pb-8 pt-20 text-text md:gap-24 md:px-10 md:pb-14 md:pt-[144px]">
            <div className="flex flex-col gap-8 md:flex-row md:gap-0">
                <SectionLabel number="04" label="Contact" accent />
                <div className="flex flex-col gap-6">
                    <h2 className="text-[56px] font-medium leading-[56px] tracking-[-0.04em] md:text-[96px] md:leading-24">Book a shoot.</h2>
                    <p className="max-w-[520px] text-body text-text-muted md:leading-[26px]">{intro}</p>
                </div>
            </div>
            <div className="flex flex-col-reverse gap-14 md:flex-row md:gap-0">
                <div className="flex flex-col gap-5 md:w-[30%] xl:w-[460px] md:shrink-0">
                    <span className="label text-text-muted">Or directly</span>
                    <div className="flex flex-col gap-1.5 text-body">
                        <a href={`mailto:${email}`} className="chrome-link w-fit">
                            {email}
                        </a>
                        {phone ? (
                            <a href={`tel:${phone.replace(/\s/g, "")}`} className="chrome-link w-fit">
                                {phone}
                            </a>
                        ) : null}
                        {socials.map((social) => (
                            <a key={social.url} href={social.url} target="_blank" rel="noreferrer" className="chrome-link w-fit">
                                {handleFor(social)}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="max-w-[900px] flex-1">
                    <ContactForm services={services} projectTitles={projectTitles} />
                </div>
            </div>
            <footer className="mt-4 flex flex-col gap-6 border-t border-line pt-6 md:mt-12 md:flex-row md:items-end md:justify-between">
                <Wordmark size="lg" />
                <div className="label flex justify-between gap-8 text-text-muted">
                    <span>{location}</span>
                    <span>© {new Date().getFullYear()}</span>
                    <a href="#top" className="chrome-link text-text">
                        Back to top ↑
                    </a>
                </div>
            </footer>
        </section>
    );
}
