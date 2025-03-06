import { z, defineCollection } from "astro:content";

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
    type: "content",
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            image: image().optional(),
            tags: z.array(tags),
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
