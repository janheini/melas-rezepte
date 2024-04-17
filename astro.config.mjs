import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import netlify from "@astrojs/netlify";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
    output: "server",
    integrations: [vue(), tailwind()],
    adapter:
        process.argv[process.argv.length - 1] === "netlify"
            ? netlify({ imageCDN: true, edgeMiddleware: false })
            : vercel({ imageService: true }),
});
