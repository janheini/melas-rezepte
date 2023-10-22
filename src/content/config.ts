import { z, defineCollection } from "astro:content";

export const tags = z.enum([
    "Vegetarisch",
    "Fleisch",
    // "Schwein",
    "Huhn",
    // "Rind",
    "Fisch",
    "Garnelen",
    "Reis",
    "Nudeln",
    "Kartoffeln",
    "Gnocchi",
    "Dessert",
]);

const rezepte = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        image: z.string().optional(),
        tags: z.array(tags).optional(),
        ingredients: z.array(z.string()),
    }),
});

export const collections = {
    rezepte: rezepte,
};
