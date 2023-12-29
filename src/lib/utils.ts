import { z } from "astro:content";
import { tags } from "../content/config.ts";
import { request } from "@octokit/request";

type IngredientList = {
    title: string;
    ingredients: Array<string>;
};

type Recipe = {
    title: string;
    tagList: Array<z.infer<typeof tags>>;
    ingredientList: Array<IngredientList>;
    instructions: string;
};

export function createValidFilename(str: string) {
    str =
        str
            .replace(/[\/\\:*?"<>|]/g, "_") // Replace invalid characters with underscores
            .replace(/\s+/g, "_") // Replace spaces with underscores
            .replace(/^\s+|\s+$/g, "") // Remove leading/trailing spaces
            .toLowerCase() + ".md"; // add markdown extension

    if (str.length > 255) {
        return str.slice(0, 255);
    }
    return str;
}

export function trimRecipe(recipe: Recipe): Recipe {
    recipe.title = recipe.title.trim();
    if (recipe.title === "") {
        throw new Error("Missing title");
    }
    for (const ingredientList of recipe.ingredientList) {
        ingredientList.title = ingredientList.title.trim();
        ingredientList.ingredients = ingredientList.ingredients
            .map((ingredient) => ingredient.trim())
            .filter((ingredient) => ingredient.length > 0);
    }
    recipe.instructions = recipe.instructions.trim();
    return recipe;
}

export function createContent(recipe: Recipe): string {
    return `
---
${JSON.stringify({
    title: recipe.title,
    tags: recipe.tagList,
    ingredientList: recipe.ingredientList,
})}
---
${recipe.instructions}
`.trim();
}

export async function getSha(path: string): Promise<string> {
    return (
        await request(`GET /repos/janheini/melas-rezepte/contents/${path}`, {
            owner: "janheini",
            repo: "melas-rezepte",
            path: path,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
    ).data.sha as string;
}

export async function deleteRecipe(filename: string) {
    const path = `src/content/rezepte/${filename}`;
    return await request(
        `DELETE /repos/janheini/melas-rezepte/contents/${path}`,
        {
            owner: "janheini",
            repo: "melas-rezepte",
            path: path,
            message: `deleted ${path}`,
            sha: await getSha(path),
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
                accept: "application/vnd.github+json",
                authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
            },
        },
    );
}

export async function changeRecipe(
    filename: string,
    title: string,
    content: string,
) {
    const path = `src/content/rezepte/${filename}`;
    return await request(`PUT /repos/janheini/melas-rezepte/contents/${path}`, {
        owner: "janheini",
        repo: "melas-rezepte",
        path: path,
        sha: await getSha(path),
        message: `changed recipe ${title}`,
        content: Buffer.from(content, "utf8").toString("base64"),
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            accept: "application/vnd.github+json",
            authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
        },
    });
}

export async function createNewRecipe(
    filename: string,
    title: string,
    content: string,
) {
    const path = `src/content/rezepte/${filename}`;
    return await request(`PUT /repos/janheini/melas-rezepte/contents/${path}`, {
        owner: "janheini",
        repo: "melas-rezepte",
        path: path,
        message: `added recipe ${title}`,
        content: Buffer.from(content, "utf8").toString("base64"),
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            accept: "application/vnd.github+json",
            authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
        },
    });
}
