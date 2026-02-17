import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "우리의 1주년",
        short_name: "1주년",
        description: "우리의 소중한 추억을 담은 1주년 기념 앱",
        start_url: "/",
        display: "standalone",
        background_color: "#FDFBF7",
        theme_color: "#FDFBF7",
        icons: [
            {
                src: "/icons/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
