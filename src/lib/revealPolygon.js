const pct = (value) => `${Math.round(value * 1000) / 1000}%`;

/**
 * One CSS polygon covering a horizontal band per row, where each band spans
 * from `start` to `end` (0–100, percent of the width). Rows split the height
 * evenly. Bands are joined by zero-width edges along the left side, so the
 * result is a single shape with no seams between neighbouring rows.
 */
export function revealPolygon(bands) {
    const rows = bands.length;
    if (!rows) return "polygon(0 0, 0 0, 0 0)";
    const points = [];
    bands.forEach(({ start, end }, index) => {
        const top = (index / rows) * 100;
        const bottom = ((index + 1) / rows) * 100;
        const left = Math.min(start, end);
        const right = Math.max(start, end);
        points.push(
            [0, top],
            [left, top],
            [right, top],
            [right, bottom],
            [left, bottom],
            [left, top],
            [0, top]
        );
    });
    return `polygon(${points.map(([x, y]) => `${pct(x)} ${pct(y)}`).join(", ")})`;
}
