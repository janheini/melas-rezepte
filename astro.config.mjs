import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import netlify from "@astrojs/netlify";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
    output: "server",
    integrations: [vue(), tailwind()],
    adapter: import.meta.env.NETLIFY
        ? netlify({ imageCDN: true, edgeMiddleware: true })
        : vercel({ imageService: true }),
});

