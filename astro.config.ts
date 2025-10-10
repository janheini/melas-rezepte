import { defineConfig, envField, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
    site: "https://melas-rezepte.vercel.app",
    output: "server",
    integrations: [svelte()],
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
                name: "Inter Tight",
                cssVariable: "--font-inter",
            },
        ],
    },
});
