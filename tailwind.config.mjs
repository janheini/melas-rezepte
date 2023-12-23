import typography from "@tailwindcss/typography";
import headlessui from "@headlessui/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "media",
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    plugins: [typography, headlessui],
};
