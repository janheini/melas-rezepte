import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import vue from "@astrojs/vue";
import { defineConfig, envField, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
    site: "https://melas-rezepte.vercel.app",
    output: "server",
    integrations: [vue()],
    adapter: vercel({ imageService: true }),
    vite: { plugins: [tailwindcss()] },
    env: {
        schema: {
            TURSO_URL: envField.string({
                context: "server",
                access: "secret",
                optional: false,
            }),
            TURSO_TOKEN: envField.string({
                context: "server",
                access: "secret",
                optional: false,
            }),
            GITHUB_TOKEN: envField.string({
                context: "server",
                access: "secret",
                optional: false,
            }),
        },
    },
    experimental: {
        fonts: [
            {
                provider: fontProviders.fontsource(),
                name: "Merriweather",
                cssVariable: "--font-merriweather",
            },
        ],
    },
});
