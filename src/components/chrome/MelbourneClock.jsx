"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    hour: "numeric",
    minute: "2-digit",
});

export function MelbourneClock() {
    const [time, setTime] = useState(null);

    useEffect(() => {
        const update = () => setTime(format.format(new Date()));
        update();
        const timer = setInterval(update, 15_000);
        return () => clearInterval(timer);
    }, []);

    return (
        <span className="label text-text" suppressHydrationWarning>
            Melbourne{time ? ` — ${time}` : ""}
        </span>
    );
}
