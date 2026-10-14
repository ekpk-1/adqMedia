"use client";

import { useEffect, useState } from "react";

const fieldClass =
    "w-full bg-transparent text-[20px] leading-7 text-text outline-none placeholder:text-text/35 md:text-subhead";

export function ContactForm({ services, projectTitles }) {
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const [service, setService] = useState(null);
    const [project, setProject] = useState(null);

    useEffect(() => {
        const slug = new URLSearchParams(window.location.search).get("project");
        if (slug && projectTitles[slug]) setProject(slug);
    }, [projectTitles]);

    async function onSubmit(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const payload = {
            name: form.get("name"),
            email: form.get("email"),
            message: form.get("message"),
            company: form.get("company") || undefined,
            service: service ?? undefined,
            project: project ?? undefined,
        };
        setStatus("sending");
        setError(null);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const body = await response.json().catch(() => ({}));
            if (!response.ok || !body.ok) throw new Error(body.error ?? "Couldn't send that just now.");
            setStatus("sent");
        } catch (sendError) {
            setError(sendError.message);
            setStatus("error");
        }
    }

    if (status === "sent") {
        return (
            <div role="status" className="flex flex-col gap-4 border-t border-line pt-8">
                <span className="label text-text-muted">Sent</span>
                <p className="text-[28px] leading-9 md:text-[36px] md:leading-[44px]">Thanks. Alex will get back to you, usually within a day.</p>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="relative flex flex-col gap-10">
            {project ? (
                <p className="label text-text-muted">
                    Asking about · <span className="text-text">{projectTitles[project]}</span>
                </p>
            ) : null}
            <div className="grid gap-10 md:grid-cols-2">
                <Field label="Name" htmlFor="contact-name">
                    <input id="contact-name" name="name" required autoComplete="name" maxLength={120} className={fieldClass} />
                </Field>
                <Field label="Email" htmlFor="contact-email">
                    <input id="contact-email" name="email" type="email" required autoComplete="email" maxLength={200} className={fieldClass} />
                </Field>
            </div>

            <fieldset className="flex flex-col gap-4">
                <legend className="label mb-4 text-text-muted">What do you need?</legend>
                <div className="flex flex-wrap gap-2">
                    {services.map((choice) => {
                        const selected = service === choice.id;
                        return (
                            <button
                                key={choice.id}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setService(selected ? null : choice.id)}
                                className={`rounded-full border px-[18px] py-2.5 text-[15px] font-medium leading-5 transition-colors md:text-body ${
                                    selected ? "border-text bg-text text-background" : "border-line text-text hover:border-text"
                                }`}
                            >
                                {choice.label}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            <Field label="About the car" htmlFor="contact-message">
                <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={3}
                    maxLength={4000}
                    placeholder="Make, model, mods, and when it's free"
                    className={`${fieldClass} min-h-[96px] resize-none`}
                />
            </Field>

            <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
                <label htmlFor="contact-company">Company</label>
                <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-col-reverse gap-5 md:flex-row md:items-center md:justify-between">
                <p className="label text-text-muted" aria-live="polite">
                    {status === "error" ? <span className="text-accent">{error}</span> : "Goes straight to Alex"}
                </p>
                <button type="submit" disabled={status === "sending"} className="btn btn-accent viewfinder w-full md:w-auto">
                    {status === "sending" ? "Sending…" : "Send enquiry"}
                    <span aria-hidden>→</span>
                </button>
            </div>
        </form>
    );
}

function Field({ label, htmlFor, children }) {
    return (
        <div className="group/field flex flex-col gap-3 border-b border-line pb-[14px] transition-colors focus-within:border-text">
            <label htmlFor={htmlFor} className="label text-text-muted transition-colors group-focus-within/field:text-text">
                {label}
            </label>
            {children}
        </div>
    );
}
