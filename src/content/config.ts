import { z, defineCollection } from "astro:content";

export const tags = z.enum([
  "Vegetarisch",
  "Fleisch",
  // "Schwein",
  "Huhn",
  // "Rind",
  "Fisch",
  "Reis",
  "Nudeln",
  "Kartoffeln",
]);

const time = z.enum(["Schnell", "Mittel", "Lange"]);

const rezepte = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    image: z.string().optional(),
    tags: z.array(tags).optional(),
    time: time,
    ingredients: z.array(z.object({
            name: z.string(), 
            amount: z.union([z.string(), z.number()])
        })),
  }),
});

export const collections = {
  rezepte: rezepte,
};
