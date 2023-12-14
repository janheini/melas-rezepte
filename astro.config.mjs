import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
    output: "server",
    integrations: [vue(), tailwind({ applyBaseStyles: false })],
    adapter: vercel(),
});
