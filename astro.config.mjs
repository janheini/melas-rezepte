import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import vue from "@astrojs/vue";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    site: "https://melas-rezepte.vercel.app",
    output: "server",
    integrations: [vue()],
    adapter: vercel({ imageService: true }),
    vite: { plugins: [tailwindcss()] },
});
