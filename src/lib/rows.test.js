import { describe, expect, it } from "vitest";
import { autoRows, gridRows } from "./rows";

const video = (id) => ({ id, type: "video", width: 1080, height: 1920 });
const portrait = (id) => ({ id, type: "image", width: 2832, height: 4240 });
const landscape = (id) => ({ id, type: "image", width: 4240, height: 2832 });

const shape = (rows) => rows.map((r) => `${r.type}:${r.slots.map((s) => s.id).join(",")}`);

describe("autoRows", () => {
    it("groups tall media into trios", () => {
        const rows = autoRows([video("v"), portrait("p1"), portrait("p2"), landscape("l1")]);
        expect(shape(rows)).toEqual(["trio:v,p1,p2", "full:l1"]);
    });

    it("alternates landscape photos between full and pair rows", () => {
        const rows = autoRows(["a", "b", "c", "d"].map(landscape));
        expect(shape(rows)).toEqual(["full:a", "pair:b,c", "full:d"]);
    });

    it("never leaves a video alone in a full row", () => {
        const middle = autoRows([landscape("a"), video("v"), landscape("b")]);
        expect(shape(middle)).toEqual(["full:a", "pair:v,b"]);

        const last = autoRows([landscape("a"), video("v")]);
        expect(shape(last)).toEqual(["pair:a,v"]);

        const only = autoRows([video("v")]);
        expect(only).toEqual([{ type: "pair", slots: [only[0].slots[0]] }]);
    });

    it("splits four tall items into two pairs", () => {
        const rows = autoRows(["a", "b", "c", "d"].map(portrait));
        expect(shape(rows)).toEqual(["pair:a,b", "pair:c,d"]);
    });
});

describe("gridRows", () => {
    it("repeats wide+narrow, three thirds, narrow+wide", () => {
        const rows = gridRows(Array.from({ length: 9 }, (_, i) => i));
        expect(rows.map((r) => r.map((cell) => cell.shape).join("+"))).toEqual([
            "wide+narrow",
            "third+third+third",
            "narrow+wide",
            "wide+narrow",
        ]);
        expect(rows.at(-1)).toHaveLength(2);
    });
});
