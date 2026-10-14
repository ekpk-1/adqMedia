// Preset rows: full (one slot), pair (two) and trio (three). Videos are 9:16,
// so a video never sits alone in a full row.

export function isTall(media) {
    return media.type === "video" || media.height > media.width;
}

function row(slots) {
    const type = slots.length === 1 ? "full" : slots.length === 2 ? "pair" : "trio";
    return { type, slots };
}

function runLength(items, start, predicate) {
    let end = start;
    while (end < items.length && predicate(items[end])) end += 1;
    return end - start;
}

/**
 * Builds rows for projects that don't have hand-built ones yet, as with
 * migrated content. Consecutive tall items group into trios and pairs;
 * landscape photos alternate between full and pair rows.
 */
export function autoRows(items) {
    const rows = [];
    let index = 0;
    let landscapeTurn = 0;

    while (index < items.length) {
        const tall = runLength(items, index, isTall);

        if (tall >= 2) {
            const size = tall >= 3 && tall !== 4 ? 3 : 2;
            rows.push(row(items.slice(index, index + size)));
            index += size;
            continue;
        }

        if (tall === 1) {
            const next = items[index + 1];
            if (next) {
                rows.push(row([items[index], next]));
                index += 2;
                continue;
            }
            const previous = rows.at(-1);
            if (previous && previous.slots.length < 3) {
                rows[rows.length - 1] = row([...previous.slots, items[index]]);
            } else {
                rows.push({ type: "pair", slots: [items[index]] });
            }
            index += 1;
            continue;
        }

        const wide = runLength(items, index, (item) => !isTall(item));
        const pairTurn = landscapeTurn % 2 === 1 && wide >= 2;
        const size = pairTurn ? 2 : 1;
        rows.push(row(items.slice(index, index + size)));
        index += size;
        landscapeTurn += 1;
    }

    return rows;
}

/** Desktop index: [wide, narrow], [third × 3], [narrow, wide], repeating. */
const GRID_PATTERN = [["wide", "narrow"], ["third", "third", "third"], ["narrow", "wide"]];

export function gridRows(tiles) {
    const rows = [];
    let index = 0;
    let turn = 0;
    while (index < tiles.length) {
        const shapes = GRID_PATTERN[turn % GRID_PATTERN.length];
        const slice = tiles.slice(index, index + shapes.length);
        rows.push(slice.map((tile, i) => ({ tile, shape: shapes[i] })));
        index += shapes.length;
        turn += 1;
    }
    return rows;
}
