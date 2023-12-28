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
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            image: image().optional(),
            tags: z.array(tags).optional(),
            ingredients: z.array(z.string()).optional(),
            ingredientList: z
                .array(
                    z.object({
                        title: z.string(),
                        ingredients: z.array(z.string()),
                    }),
                )
                .optional(),
        }),
});

export const collections = {
    rezepte: rezepte,
};
