<script lang="ts">
    import { actions } from "astro:actions";
    import { navigate } from "astro:transitions/client";
    import ConfirmDeleteButton from "@components/ConfirmDeleteButton.svelte";
    import type { CollectionEntry } from "astro:content";

    type Recipe = CollectionEntry<"rezepte">;
    type IngredientList = Recipe["data"]["ingredientList"];

    let error = $state("");
    const { recipe, slug }: { recipe?: Recipe; slug?: string } = $props();

    let title = $state(recipe?.data.title || "");
    let ingredientList: IngredientList = $state(
        recipe?.data.ingredientList || [
            {
                title: "",
                ingredients: [""],
            },
        ],
    );
    for (const list of ingredientList) {
        // Add an empty slot at the end of every ingredientList
        if (list.ingredients[list.ingredients.length - 1]) {
            list.ingredients.push("");
        }
    }

    let instructions = $state(recipe?.body || "");
</script>

{#snippet add<T>(what: T, where: Array<T>)}
    <button aria-label="add" onclick={() => where.push(what)}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5"
        >
            <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                clip-rule="evenodd"
            />
        </svg>
    </button>
{/snippet}

{#snippet ingredient(ingredientList: IngredientList, i: number, j: number)}
    <div class="flex gap-1">
        <input
            type="text"
            class="border min-w-xs px-1"
            placeholder="Zutat"
            bind:value={ingredientList[i].ingredients[j]}
            oninput={() => {
                if (j === ingredientList[i].ingredients.length - 1) {
                    ingredientList[i].ingredients.push("");
                }
            }}
        />
    </div>
{/snippet}

<div class="pb-6">
    <h1>Rezept ändern</h1>
    <form
        method="POST"
        class="pb-4"
        onsubmit={async (event) => {
            event.preventDefault();
            const result = await actions.editRecipe({
                title: title,
                slug: slug,
                ingredientList: ingredientList,
                instructions: instructions,
            });
            // TODO: Improve error handling and display
            if (result.error) {
                error = result.error.message;
            } else {
                navigate("/");
            }
        }}
    >
        <div class="pb-2">
            <input
                class="border text-2xl font-black w-md px-1"
                placeholder="Titel"
                bind:value={title}
            />
        </div>
        <div>Zutaten</div>
        {#each ingredientList as list, i}
            <div class="pb-2">
                <div class="flex gap-1">
                    <input
                        class="border min-w-xs px-1"
                        placeholder="Titel (leer für einfache Liste)"
                        bind:value={list.title}
                    />
                    {#if i === ingredientList.length - 1}
                        {@render add(
                            {
                                title: "",
                                ingredients: [""],
                            },
                            ingredientList,
                        )}
                    {/if}
                </div>
                <div class="px-4 pt-1 grid grid-cols-1 gap-1">
                    {#each list.ingredients as _, j}
                        {@render ingredient(ingredientList, i, j)}
                    {/each}
                </div>
            </div>
        {/each}
        <div class="pb-2">
            <div>Anleitung</div>
            <textarea
                class="min-h-80 border p-1 w-full leading-snug"
                placeholder="Anleitung"
                bind:value={instructions}
            ></textarea>
        </div>
        <input
            class="border w-full hover:cursor-pointer"
            type="submit"
            value="Speichern"
        />
    </form>
    {#if error}
        <div class="border px-2 border-red-600">{error}</div>
    {/if}
    {#if recipe}
        <ConfirmDeleteButton slug={recipe.id} bind:error />
    {/if}
</div>
