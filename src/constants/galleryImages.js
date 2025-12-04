// // Common span configurations for reusability
const SPANS = {
    FULL: "col-span-12",
    HALF: "col-span-6",
    THIRD: "col-span-4",
    QUARTER: "col-span-3",
    FULL_WIDE:
        "col-span-12 lg:col-span-12 aspect-[16/9] max-sm:col-span-12 max-sm:aspect-[4/3]",
    HALF_SQUARE:
        "col-span-6 lg:col-span-6 aspect-[4/3] max-sm:col-span-6 max-sm:aspect-[4/3]",
    THIRD_SQUARE: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
    QUARTER_SQUARE: "col-span-3 aspect-square max-sm:col-span-6",
};

export const galleryImages = [
    // S2K - Japan
    {
        src: "/gallery/s2k/1.webp",
        alt: "S2K - Front View",
        span: SPANS.FULL,
        group: "s2k",
    },
    {
        src: "/gallery/s2k/2.webp",
        alt: "S2K - Side View",
        span: SPANS.FULL,
        group: "s2k",
    },
    {
        src: "/gallery/s2k/3.webp",
        alt: "S2K - Side View",
        span: SPANS.QUARTER,
        group: "s2k",
    },
    {
        src: "/gallery/s2k/4.webp",
        alt: "S2K - Side View",
        span: SPANS.QUARTER,
        group: "s2k",
    },
    {
        src: "/gallery/s2k/5.webp",
        alt: "S2K - Side View",
        span: SPANS.QUARTER,
        group: "s2k",
    },
    {
        src: "/gallery/s2k/6.webp",
        alt: "S2K - Side View",
        span: SPANS.QUARTER,
        group: "s2k",
    },
    // M2 4/12/2025
    {
        src: "/gallery/m2/1.webp",
        alt: "M2 - Front View",
        span: SPANS.FULL,
        group: "m2",
    },
    {
        src: "/gallery/m2/2.webp",
        alt: "M2 - Side View",
        span: SPANS.FULL,
        group: "m2",
    },
    {
        src: "/gallery/m2/3.webp",
        alt: "M2 - Side View",
        span: SPANS.THIRD,
        group: "m2",
    },
    {
        src: "/gallery/m2/4.webp",
        alt: "M2 - Side View",
        span: SPANS.THIRD,
        group: "m2",
    },
    {
        src: "/gallery/m2/5.webp",
        alt: "M2 - Front View",
        span: SPANS.THIRD,
        group: "m2",
    },
    {
        src: "/gallery/m2/6.webp",
        alt: "M2 - Side View",
        span: "col-span-6 row-span-2 aspect-[3/4]",
        group: "m2",
    },
    {
        src: "/gallery/m2/7.webp",
        alt: "M2 - Side View",
        span: "col-span-6 row-span-1 aspect-[16/10]",
        group: "m2",
    },
    {
        src: "/gallery/m2/8.webp",
        alt: "M2 - Side View",
        span: "col-span-6 row-span-1 aspect-[16/10]",
        group: "m2",
    },
    // R32 4/12/2025
    {
        src: "/gallery/r32/1.webp",
        alt: "Black R32 - Side View",
        span: SPANS.FULL,
        group: "r32x2",
    },
    {
        src: "/gallery/r32/3.webp",
        alt: "Black R32 - Side View",
        span: SPANS.THIRD,
        group: "r32x2",
    },
    {
        src: "/gallery/r32/5.webp",
        alt: "Black R32 - Side View",
        span: SPANS.THIRD,
        group: "r32x2",
    },
    {
        src: "/gallery/r32/4.webp",
        alt: "Black R32 - Side View",
        span: SPANS.THIRD,
        group: "r32x2",
    },
    {
        src: "/gallery/r32/2.webp",
        alt: "Black R32 - Side View",
        span: SPANS.FULL,
        group: "r32x2",
    },

    // Yellow 996 Porsche
    {
        src: "/gallery/996-1.webp",
        alt: "Yellow 996 - Front View",
        span: "col-span-12",
        group: "996",
    },
    {
        src: "/gallery/996-2.webp",
        alt: "Yellow 996 - Side View",
        span: "col-span-4",
        group: "996",
    },
    {
        src: "/gallery/996-3.webp",
        alt: "Yellow 996 - Detail Shot 1",
        span: "col-span-4",
        group: "996",
    },
    {
        src: "/gallery/996-4.webp",
        alt: "Yellow 996 - Detail Shot 2",
        span: "col-span-4",
        group: "996",
    },
    {
        src: "/gallery/996-5.webp",
        alt: "Yellow 996 - Interior",
        span: "col-span-6",
        group: "996",
    },
    {
        src: "/gallery/996-6.webp",
        alt: "Yellow 996 - Engine Bay",
        span: "col-span-6",
        group: "996",
    },
    {
        src: "/gallery/996-7.webp",
        alt: "Yellow 996 - Rear View",
        span: "col-span-12",
        group: "996",
    },

    // Rush's M3
    {
        src: "/gallery/rushsM3-1.jpg",
        alt: "Rushs M3 - Front View",
        span: "col-span-12 lg:col-span-12 aspect-[16/9] max-sm:col-span-12 max-sm:aspect-[4/3]",
        group: "rushsM3",
    },
    {
        src: "/gallery/rushsM3-5.jpg",
        alt: "Rushs M3 - Side View",
        span: "col-span-6 lg:col-span-6 aspect-[4/3] max-sm:col-span-6 max-sm:aspect-[4/3]",
        group: "rushsM3",
    },
    {
        src: "/gallery/rushsM3-3.jpg",
        alt: "Rushs M3 - Interior",
        span: "col-span-6 lg:col-span-6 aspect-[4/3] max-sm:col-span-6 max-sm:aspect-[4/3]",
        group: "rushsM3",
    },
    {
        src: "/gallery/rushsM3-4.jpg",
        alt: "Rushs M3 - Detail Shot",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "rushsM3",
    },
    {
        src: "/gallery/rushsM3-6.jpg",
        alt: "Rushs M3 - Rear View",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "rushsM3",
    },
    {
        src: "/gallery/rushsM3-2.jpg",
        alt: "Rushs M3 - Profile View",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-12",
        group: "rushsM3",
    },

    // Tookie's EVO
    {
        src: "/gallery/tookie3.jpg",
        alt: "Tookie EVO - Front View",
        span: "col-span-12 lg:col-span-12 aspect-[16/9] max-sm:col-span-12 max-sm:aspect-[4/3]",
        group: "tookieEVO",
    },
    {
        src: "/gallery/tookie1.jpg",
        alt: "Tookie EVO - Side View",
        span: "col-span-4 lg:col-span-4 aspect-[3/4] max-sm:col-span-6 max-sm:aspect-[4/3]",
        group: "tookieEVO",
    },
    {
        src: "/gallery/tookie2.jpg",
        alt: "Tookie EVO - Interior",
        span: "col-span-4 lg:col-span-4 aspect-[3/4] max-sm:col-span-6 max-sm:aspect-[4/3]",
        group: "tookieEVO",
    },
    {
        src: "/gallery/tookie5.jpg",
        alt: "Tookie EVO - Detail Shot",
        span: "col-span-4 lg:col-span-4 aspect-[3/4] max-sm:col-span-12 max-sm:aspect-[2/1]",
        group: "tookieEVO",
    },
    {
        src: "/gallery/tookie4.jpg",
        alt: "Tookie EVO - Engine Bay",
        span: "col-span-4 lg:col-span-8 aspect-[2/1] max-sm:col-span-6 max-sm:aspect-[3/3] max-md:col-span-6",
        group: "tookieEVO",
    },
    {
        src: "/gallery/tookie6.jpg",
        alt: "Tookie EVO - Rear View",
        span: "col-span-4 lg:col-span-4 aspect-[4/4.2] max-sm:col-span-6 max-sm:aspect-[3/3] max-md:aspect-[2/1] max-md:col-span-6",
        group: "tookieEVO",
    },

    // N8's EVO
    {
        src: "/gallery/n8dawg3.jpg",
        alt: "N8 EVO - Front View",
        span: "col-span-6 aspect-square row-span-2 max-sm:col-span-12 max-sm:row-span-1",
        group: "n8EVO",
    },
    {
        src: "/gallery/n8dawg43.jpg",
        alt: "N8 EVO - Side View",
        span: "col-span-3 aspect-square max-sm:col-span-6",
        group: "n8EVO",
    },
    {
        src: "/gallery/n8dawg45.jpg",
        alt: "N8 EVO - Interior",
        span: "col-span-3 aspect-square max-sm:col-span-6",
        group: "n8EVO",
    },
    {
        src: "/gallery/evoN83.jpg",
        alt: "N8 EVO - Detail Shot",
        span: "col-span-3 aspect-square max-sm:col-span-6",
        group: "n8EVO",
    },
    {
        src: "/gallery/n8dawg42.jpg",
        alt: "N8 EVO - Engine Bay",
        span: "col-span-3 aspect-square max-sm:col-span-6",
        group: "n8EVO",
    },

    // Civic EK
    {
        src: "/gallery/civicEK.jpg",
        alt: "Civic EK - Front View",
        span: "col-span-4 lg:col-span-12 aspect-[16/10] max-sm:col-span-12 max-md:col-span-12",
        group: "civicEK",
    },
    {
        src: "/gallery/ek5.jpg",
        alt: "Civic EK - Side View",
        span: "col-span-4 lg:col-span-6 aspect-[4/3] max-sm:col-span-12 max-md:col-span-6",
        group: "civicEK",
    },
    {
        src: "/gallery/ek4.jpg",
        alt: "Civic EK - Interior",
        span: "col-span-4 lg:col-span-6 aspect-[4/3] max-sm:col-span-12 max-md:col-span-6",
        group: "civicEK",
    },
    {
        src: "/gallery/ekBay2.jpg",
        alt: "Civic EK - Engine Bay 1",
        span: "col-span-4 lg:col-span-3 aspect-[3/4] max-sm:col-span-6",
        group: "civicEK",
    },
    {
        src: "/gallery/ekBay1.jpg",
        alt: "Civic EK - Engine Bay 2",
        span: "col-span-4 lg:col-span-3 aspect-[3/4] max-sm:col-span-6",
        group: "civicEK",
    },
    {
        src: "/gallery/ek2.jpg",
        alt: "Civic EK - Detail Shot 1",
        span: "col-span-4 lg:col-span-3 aspect-[3/4] max-sm:col-span-6",
        group: "civicEK",
    },
    {
        src: "/gallery/ek3.jpg",
        alt: "Civic EK - Detail Shot 2",
        span: "col-span-4 lg:col-span-3 aspect-[3/4] max-sm:col-span-6",
        group: "civicEK",
    },

    // Chaser
    {
        src: "/gallery/chaser3.jpg",
        alt: "Chaser - Front View",
        span: "col-span-4 lg:col-span-8 lg:row-span-2 aspect-[4/3] max-sm:col-span-12 max-md:col-span-8",
        group: "chaser",
    },
    {
        src: "/gallery/chaser5.jpg",
        alt: "Chaser - Side View",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6 max-md:col-span-6",
        group: "chaser",
    },
    {
        src: "/gallery/chaser4.jpg",
        alt: "Chaser - Interior",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6 max-md:col-span-6",
        group: "chaser",
    },

    // Toyota 86
    {
        src: "/gallery/861.jpg",
        alt: "86 - Front View",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-12",
        group: "86",
    },
    {
        src: "/gallery/862.jpg",
        alt: "86 - Side View",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "86",
    },
    {
        src: "/gallery/863.jpg",
        alt: "86 - Interior",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "86",
    },
    {
        src: "/gallery/864.jpg",
        alt: "86 - Detail Shot 1",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "86",
    },
    {
        src: "/gallery/865.jpg",
        alt: "86 - Detail Shot 2",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "86",
    },

    // Honda Jazz
    {
        src: "/gallery/jazz1.jpg",
        alt: "Jazz - Front View",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "jazz",
    },
    {
        src: "/gallery/jazz2.jpg",
        alt: "Jazz - Side View",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "jazz",
    },
    {
        src: "/gallery/jazz3.jpg",
        alt: "Jazz - Interior",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "jazz",
    },
    {
        src: "/gallery/jazz4.jpg",
        alt: "Jazz - Detail Shot",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "jazz",
    },

    // Ferrari
    {
        src: "/gallery/rari2.jpg",
        alt: "Ferrari - Side View",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "ferrari",
    },
    {
        src: "/gallery/rari3.jpg",
        alt: "Ferrari - Interior",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-6",
        group: "ferrari",
    },
    {
        src: "/gallery/rari4.jpg",
        alt: "Ferrari - Detail Shot",
        span: "col-span-4 lg:col-span-4 aspect-[4/3] max-sm:col-span-12",
        group: "ferrari",
    },
];
