"use client";

const OPTIONS = [
    { id: "layout", label: "Layout" },
    { id: "scroll", label: "Scroll" },
];

export function ViewToggle({ view, onChange }) {
    return (
        <div role="radiogroup" aria-label="Project view" className="flex items-center gap-1 rounded-full border border-line p-1">
            {OPTIONS.map((option) => {
                const checked = view === option.id;
                return (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() => onChange(option.id)}
                        className={`label rounded-full px-3 py-[7px] leading-[14px] transition-colors md:px-4 md:py-2 ${
                            checked ? "bg-text text-background" : "text-text-muted hover:text-text"
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
