import { z, defineCollection } from "astro:content";

export const tags = z.enum([
  "Vegetarisch",
  "Fleisch",
  // "Schwein",
  "Hähnchen",
  // "Rind",
  "Fisch",
  "Garnelen",
  "Reis",
  "Nudeln",
  "Kartoffeln",
  "Gnocchi",
]);

const time = z.enum(["Schnell", "Mittel", "Lange"]);

const rezepte = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    image: z.string().optional(),
    tags: z.array(tags).optional(),
    time: time,
    ingredients: z.array(z.string()),
  }),
});

export const collections = {
  rezepte: rezepte,
};
