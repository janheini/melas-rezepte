import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const tags = z.enum([
    "Reis",
    "Nudeln",
    "Kartoffeln",
    "Gnocchi",
    "Vegetarisch",
    "Fleisch",
    "Huhn",
    "Fisch",
    "Backen",
    "Dessert",
]);

const rezepte = defineCollection({
    loader: glob({ pattern: "*.md", base: "src/content/rezepte/" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            image: image().optional(),
            tags: z.array(tags).optional(),
            ingredientList: z.array(
                z.object({
                    title: z.string(),
                    ingredients: z.array(z.string()),
                }),
            ),
        }),
});

export const collections = {
    rezepte: rezepte,
};
