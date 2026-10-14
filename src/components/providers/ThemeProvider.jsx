"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { THEME_KEY, resolveTheme } from "@/lib/theme";

const ThemeContext = createContext(null);
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readStored() {
    try {
        const value = localStorage.getItem(THEME_KEY);
        return value === "light" || value === "dark" ? value : "system";
    } catch {
        return "system";
    }
}

function apply(theme) {
    document.documentElement.classList.toggle("theme-light", theme === "light");
}

export function ThemeProvider({ children }) {
    const [preference, setPreferenceState] = useState("system");
    const [systemDark, setSystemDark] = useState(true);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const query = matchMedia(DARK_QUERY);
        // Sync with what the boot script already applied before paint.
        setPreferenceState(readStored());
        setSystemDark(query.matches);
        setReady(true);
        const onChange = (event) => setSystemDark(event.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    const theme = resolveTheme(preference, systemDark);

    useEffect(() => {
        if (ready) apply(theme);
    }, [ready, theme]);

    const setPreference = useCallback((next) => {
        try {
            if (next === "system") localStorage.removeItem(THEME_KEY);
            else localStorage.setItem(THEME_KEY, next);
        } catch {
            // Private mode: the choice lasts for this page view only.
        }
        setPreferenceState(next);
    }, []);

    const value = useMemo(() => ({ preference, theme, setPreference }), [preference, theme, setPreference]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used inside ThemeProvider");
    return context;
}
