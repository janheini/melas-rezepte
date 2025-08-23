import {
    createValidFilename,
    createContent,
    changeRecipe,
    deleteRecipe,
    createNewRecipe,
} from "@lib/utils";
import { getEntry } from "astro:content";
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";

export const server = {
    editRecipe: defineAction({
        input: z.object({
            title: z.string(),
            slug: z.string().optional(),
            ingredientList: z.array(
                z.object({
                    title: z.string(),
                    ingredients: z.array(z.string()),
                }),
            ),
            instructions: z.string(),
        }),
        handler: async (input, context) => {
            if (!context.locals.session)
                throw new ActionError({ code: "UNAUTHORIZED" });

            input.title = input.title.trim();
            if (!input.title)
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Missing Title",
                });

            for (const ingredientList of input.ingredientList) {
                ingredientList.title = ingredientList.title.trim();
                ingredientList.ingredients = ingredientList.ingredients
                    .map((ingredient) => ingredient.trim())
                    .filter((ingredient) => ingredient.length > 0);
            }
            input.instructions = input.instructions.trim();

            const recipe = input.slug
                ? await getEntry("rezepte", input.slug)
                : undefined;

            const filename = recipe ? recipe.id : undefined;
            const newFilename = createValidFilename(input.title);
            const content = createContent(input);

            // TODO: This can be optimized

            if (!recipe) {
                // Creating a new recipe
                const result = await createNewRecipe(
                    newFilename,
                    input.title,
                    content,
                );
                if (result.status !== 201) {
                    throw result;
                }
                return;
            }

            if (filename === newFilename) {
                // Alter an existing recipe, keeping the name
                const result = await changeRecipe(
                    filename,
                    input.title,
                    content,
                );
                if (result.status !== 200) {
                    throw result;
                }
                return;
            }

            // Title changed, delete old recipe and create new
            // FIXME: HEREREREREREAREAREARGAERAEJRGEAGR
            const deleteResult = await deleteRecipe(recipe);
            const createResult = await createNewRecipe(
                newFilename,
                input.title,
                content,
            );

            if (deleteResult.status !== 200) {
                throw deleteResult;
            }

            if (createResult.status !== 201) {
                throw createResult;
            }
        },
    }),
    deleteRecipe: defineAction({
        input: z.string(),
        handler: async (input, context) => {
            // Delete a recipe given its id / slug
            if (!context.locals.session)
                throw new ActionError({ code: "UNAUTHORIZED" });

            const recipe = await getEntry("rezepte", input);
            if (!recipe) throw new ActionError({ code: "NOT_FOUND" });
            await deleteRecipe(recipe);
        },
    }),
};
