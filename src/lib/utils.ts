import { z, type CollectionEntry } from "astro:content";
import { tags } from "@content.config.ts";
import { request } from "@octokit/request";
import { GITHUB_TOKEN } from "astro:env/server";
import { ActionError } from "astro:actions";

export function validateLoginForm(formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        throw "Invalid username";
    }

    if (
        typeof password !== "string" ||
        password.length < 6 ||
        password.length > 255
    ) {
        throw "Invalid password";
    }

    return [username, password];
}

type IngredientList = {
    title: string;
    ingredients: Array<string>;
};

type Recipe = {
    title: string;
    tagList?: Array<z.infer<typeof tags>>;
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

export const createContent = (recipe: Recipe) =>
    `
---
${JSON.stringify(
    {
        title: recipe.title,
        tags: recipe.tagList,
        ingredientList: recipe.ingredientList,
    },
    null,
    2,
)}
---

${recipe.instructions}`.trimStart();

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

export async function deleteRecipe(recipe: CollectionEntry<"rezepte">) {
    // TODO: changeRecipe should work like this
    const path = recipe.filePath;
    if (!path) throw new ActionError({ code: "NOT_FOUND" });
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
                authorization: `token ${GITHUB_TOKEN}`,
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
            authorization: `token ${GITHUB_TOKEN}`,
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
            authorization: `token ${GITHUB_TOKEN}`,
        },
    });
}
