/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
        qualities: [60, 75, 85],
    },
    async redirects() {
        return [
            { source: "/showcase", destination: "/?filter=creative", permanent: true },
            { source: "/commercial", destination: "/?filter=commercial", permanent: true },
            { source: "/commercial/:client", destination: "/?filter=commercial", permanent: true },
            { source: "/about", destination: "/info", permanent: true },
            { source: "/services", destination: "/info#services", permanent: true },
        ];
    },
};

export default nextConfig;
