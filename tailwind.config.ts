import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#FDFBF7",
                foreground: "#2C2C2C",
                primary: {
                    DEFAULT: "#8B5E3C",
                    light: "#A67B5B",
                    dark: "#6F4B30",
                },
                secondary: {
                    DEFAULT: "#D4AF37", // Gold
                    light: "#E5CCA0",
                },
                accent: {
                    pink: "#FFD1DC", // Soft Pink
                    rose: "#E6A8B5",
                },
            },
            fontFamily: {
                serif: ["var(--font-nanum-myeongjo)", "serif"],
            },
        },
    },
    plugins: [],
};
export default config;
