<script lang="ts">
    import { onMount } from "svelte";

    type RecipeListEntry = {
        id: string;
        data: {
            title: string;
            tags: string[];
            ingredients?: string[];
            ingredientList?: Array<{
                title: string;
                ingredients: string[];
            }>;
        };
    };

    const props: { recipes: RecipeListEntry[] } = $props();

    let search_input = $state("");
    let recipes = $state(props.recipes);

    function ingredients_contain_str(recipe: RecipeListEntry) {
        const ingredients =
            recipe.data.ingredients ||
            recipe.data.ingredientList?.flatMap((i) => i.ingredients);

        return ingredients?.some((i) =>
            i.toLowerCase().includes(search_input.trim().toLowerCase()),
        );
    }

    function title_contains_str(recipe: RecipeListEntry) {
        return recipe.data.title
            .toLowerCase()
            .includes(search_input.trim().toLowerCase());
    }

    function search() {
        recipes = props.recipes.filter(
            (recipe) =>
                title_contains_str(recipe) || ingredients_contain_str(recipe),
        );
    }

    onMount(search);
</script>

<div>
    <input
        id="search"
        type="text"
        class="w-full border-y mb-2 border-gray-400 py-1 xl:text-xl lg:text-lg focus:outline-0"
        placeholder="suche"
        autocomplete="off"
        bind:value={search_input}
        oninput={search}
    />

    <ul>
        {#each recipes as recipe}
            <li class="lg:text-lg py-1">
                <a
                    style={`view-transition-name: ${recipe.id.replaceAll("_", "__")}`}
                    href="/rezepte/{recipe.id}"
                >
                    {recipe.data.title}</a
                >
            </li>
        {:else}
            <li class="lg:text-lg py-1">kein Rezept gefunden</li>
        {/each}
    </ul>
</div>
