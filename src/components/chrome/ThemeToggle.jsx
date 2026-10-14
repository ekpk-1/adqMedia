"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

const OPTIONS = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "system", label: "System" },
];

export function ThemeToggle() {
    const { preference, setPreference } = useTheme();
    return (
        <div role="radiogroup" aria-label="Colour theme" className="flex rounded-full border border-line p-[3px]">
            {OPTIONS.map((option) => {
                const checked = preference === option.id;
                return (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() => setPreference(option.id)}
                        className={`label rounded-full px-[14px] py-[6px] transition-colors focus-visible:outline-offset-1 ${
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
