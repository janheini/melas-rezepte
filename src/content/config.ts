import { z, defineCollection } from "astro:content";

const tags = z.enum([
  "Vegetarisch",
  "Schwein",
  "Huhn",
  "Rind",
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
