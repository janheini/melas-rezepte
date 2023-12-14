import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx,vue,astro}",
        "./components/**/*.{ts,tsx,vue,astro}",
        "./app/**/*.{ts,tsx,vue,astro}",
        "./src/**/*.{ts,tsx,vue,astro}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: "hsl(var(--card))",
                "card-foreground": "hsl(var(--card-foreground))",
                popover: "hsl(var(--popover))",
                "popover-foreground": "hsl(var(--popover-foreground))",
                primary: "hsl(var(--primary))",
                "primary-foreground": "hsl(var(--primary-foreground))",
                secondary: "hsl(var(--secondary))",
                "secondary-foreground": "hsl(var(--secondary-foreground))",
                muted: "hsl(var(--muted))",
                "muted-foreground": "hsl(var(--muted-foreground))",
                accent: "hsl(var(--accent))",
                "accent-foreground": "hsl(var(--accent-foreground))",
                destructive: "hsl(var(--destructive))",
                "destructive-foreground": "hsl(var(--destructive-foreground))",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                radius: "hsl(var(--radius))",
            },
            typography: ({ theme }) => ({
                default: {
                    css: {
                        "--tw-prose-body": theme("colors.foreground"),
                        "--tw-prose-headings": theme("colors.foreground"),
                        "--tw-prose-lead": theme("colors.foreground"),
                        "--tw-prose-links": theme("colors.foreground"),
                        "--tw-prose-bold": theme("colors.foreground"),
                        "--tw-prose-counters": theme("colors.foreground"),
                        "--tw-prose-bullets": theme("colors.foreground"),
                        "--tw-prose-hr": theme("colors.foreground"),
                        "--tw-prose-quotes": theme("colors.foreground"),
                        "--tw-prose-quote-borders": theme("colors.foreground"),
                        "--tw-prose-captions": theme("colors.foreground"),
                        "--tw-prose-code": theme("colors.foreground"),
                        "--tw-prose-pre-code": theme("colors.foreground"),
                        "--tw-prose-pre-bg": theme("colors.foreground"),
                        "--tw-prose-th-borders": theme("colors.foreground"),
                        "--tw-prose-td-borders": theme("colors.foreground"),
                        "--tw-prose-invert-body": theme("colors.foreground"),
                        "--tw-prose-invert-headings":
                            theme("colors.foreground"),
                        "--tw-prose-invert-lead": theme("colors.foreground"),
                        "--tw-prose-invert-links": theme("colors.foreground"),
                        "--tw-prose-invert-bold": theme("colors.foreground"),
                        "--tw-prose-invert-counters":
                            theme("colors.foreground"),
                        "--tw-prose-invert-bullets": theme("colors.foreground"),
                        "--tw-prose-invert-hr": theme("colors.foreground"),
                        "--tw-prose-invert-quotes": theme("colors.foreground"),
                        "--tw-prose-invert-quote-borders":
                            theme("colors.foreground"),
                        "--tw-prose-invert-captions":
                            theme("colors.foreground"),
                        "--tw-prose-invert-code": theme("colors.foreground"),
                        "--tw-prose-invert-pre-code":
                            theme("colors.foreground"),
                        "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
                        "--tw-prose-invert-th-borders":
                            theme("colors.foreground"),
                        "--tw-prose-invert-td-borders":
                            theme("colors.foreground"),
                    },
                },
            }),
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [animate, typography],
};
