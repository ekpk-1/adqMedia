"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FILTERS, parseFilter } from "@/lib/projects";

export function useIndexParams() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const filter = parseFilter(params.get("filter"));
    const view = params.get("view") === "carousel" ? "carousel" : "grid";

    const update = useCallback(
        (key, value, fallback) => {
            const next = new URLSearchParams(params.toString());
            if (value === fallback) next.delete(key);
            else next.set(key, value);
            const query = next.toString();
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        },
        [params, pathname, router]
    );

    return {
        filter,
        view,
        setFilter: (value) => update("filter", value, "all"),
        setView: (value) => update("view", value, "grid"),
    };
}

const FILTER_LABELS = { creative: "Creative", all: "All", commercial: "Commercial" };

export function FilterToggle({ filter, onChange, size = "md" }) {
    return (
        <div
            role="radiogroup"
            aria-label="Filter projects"
            className={`flex items-center ${size === "sm" ? "gap-3" : "gap-8"}`}
        >
            {FILTERS.map((id) => (
                <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={filter === id}
                    onClick={() => onChange(id)}
                    className={`chrome-link label transition-colors ${size === "sm" ? "text-[10px] leading-3" : ""} ${
                        filter === id ? "text-text" : "text-text-muted hover:text-text"
                    }`}
                >
                    {FILTER_LABELS[id]}
                </button>
            ))}
        </div>
    );
}

export function ViewSwitch({ view, onChange, size = "md" }) {
    const small = size === "sm";
    return (
        <div role="radiogroup" aria-label="Index view" className={`flex items-center ${small ? "gap-2.5" : "gap-6"}`}>
            {[
                { id: "grid", label: "Grid" },
                { id: "carousel", label: "Carousel" },
            ].map((option) => {
                const checked = view === option.id;
                return (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() => onChange(option.id)}
                        className={`chrome-link label flex items-center gap-2 transition-colors ${
                            small ? "text-[10px] leading-3" : ""
                        } ${checked ? "text-text" : "text-text-muted hover:text-text"}`}
                    >
                        {checked ? (
                            <span aria-hidden className={`${small ? "size-[5px]" : "size-[6px]"} rounded-full bg-text`} />
                        ) : null}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
