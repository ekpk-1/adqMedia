"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const returnFocusTo = useRef(null);

    const open = useCallback(() => {
        returnFocusTo.current = document.activeElement;
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        const target = returnFocusTo.current;
        requestAnimationFrame(() => target?.focus?.());
    }, []);

    const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (!context) throw new Error("useMenu must be used inside MenuProvider");
    return context;
}
