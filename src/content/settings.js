// Site settings singleton. The email and Instagram handle come from the Paper
// designs and still need confirming with Alex before launch.
export const settings = {
    email: "hello@adqmedia.com.au",
    phone: null,
    location: "Melbourne, AU",
    socials: [{ label: "Instagram", url: "https://www.instagram.com/adq.media" }],
    showreel: {
        title: "Showreel 2025",
        caption: "Showreel — Melbourne, 2025",
        src: "/reel/showreel.mp4",
        poster: "/posters/hero-15s.jpg",
    },
    info: {
        statement:
            "Melbourne car photography and film, made by someone who'd be at the meet anyway.",
        facts: [
            { value: "2024", label: "Shooting freelance since" },
            { value: "500+", label: "Dealership listings shot" },
            { value: "8", label: "Workshops and brands" },
            { value: "Photo + film", label: "Own gear, one shooter" },
        ],
        still: { src: "/posters/hero-18s.jpg", caption: "Showreel 2025 — Melbourne" },
        aboutLead:
            "ADQ Media is Alex Quach, a car photographer and videographer based in Melbourne. He went freelance in mid 2024 and shoots every job on his own camera and gear.",
        aboutBody: [
            "Before that, Alex worked as a dealership photographer, shooting more than 500 new and used vehicle listings. He has since worked with workshops, detailers and tint shops to lift how they show up on social media.",
            "Luxury and performance cars are what got him started, and they're still what he shoots on his own time. The client work and the personal builds come from the same place.",
        ],
        contactIntro:
            "Tell Alex about the car, what you need it for and when. Photos, video or both.",
    },
    services: [
        {
            id: "pre-sale",
            audience: "For private sellers",
            title: "Pre-sale photography",
            chip: "Pre-sale photos",
            pitch: "Selling your car? A full listing set, shot so buyers see every detail before they message you.",
            youGet: "25+ edited photos",
            where: "Your home, or a good spot nearby",
            image: "/gallery/servicePage/DSC08745.webp",
        },
        {
            id: "social",
            audience: "For workshops and brands",
            title: "Social media package",
            chip: "Social media package",
            pitch: "Content for paid ads or organic reach: sales videos, customer car showcases, before-and-afters and install videos.",
            youGet: "20+ photos and 1 video reel",
            where: "Your workshop, garage or warehouse",
            image: "/gallery/servicePage/DSC08553.webp",
        },
    ],
};

export const SERVICE_CHOICES = [
    ...settings.services.map((service) => ({ id: service.id, label: service.chip })),
    { id: "other", label: "Something else" },
];
