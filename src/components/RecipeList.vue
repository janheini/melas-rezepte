<script setup lang="ts">
import { ref } from "vue";
import { Switch } from "@headlessui/vue";

type RecipeListEntry = {
    id: string;
    data: {
        title: string;
        tags: string[];
    };
};

const props = defineProps<{
    recipes: RecipeListEntry[];
    tags: string[];
}>();

const recipes = ref(props.recipes);
const filters = ref<Array<string>>([]);
const search_input = ref("");

function filter() {
    // 1. reset list to default from props
    recipes.value = props.recipes;

    // 2. filter by tags
    for (const f of filters.value) {
        recipes.value = recipes.value.filter(
            (recipe) => recipe.data.tags && recipe.data.tags.indexOf(f) > -1,
        );
    }

    // 3. filter by search_input (case-insensitive)
    recipes.value = recipes.value.filter((recipe) =>
        recipe.data.title
            .toLowerCase()
            .includes(search_input.value.trim().toLowerCase()),
    );
}

function toggleTag(name: string, state: boolean) {
    if (state == false) {
        filters.value.splice(filters.value.indexOf(name), 1);
    }
    if (state == true) {
        filters.value.push(name);
    }
    filter();
}

// NOTE: on View-Transitions
// Astro's 'transition-name' attribute does not work in client-side js
// frameworks. We therefore manually set
// :style="`view-transition-name: ${recipe.id.replaceAll('_', '__')};`"
// on each entry of the recipe list. This adds the same CSS style that astro
// ultimately also sets. This may break with an update.
// See: https://github.com/withastro/astro/blob/main/packages/astro/src/runtime/server/transition.ts#L143
</script>

<template>
    <div class="flex flex-wrap justify-between gap-x-6 gap-y-4">
        <Switch
            id="{tag}"
            v-for="tag in props.tags"
            :default-checked="false"
            @update:model-value="(value) => toggleTag(tag, value)"
            v-slot="{ checked }"
        >
            <div
                class="h-8 border border-dashed px-4"
                :class="{
                    'border border-dashed bg-gray-300 text-black': checked,
                }"
            >
                {{ tag }}
            </div>
        </Switch>
    </div>
    <div class="pt-6">
        <input
            placeholder="Suche"
            v-model="search_input"
            @input="filter"
            class="w-full border border-dotted px-2 focus:border-solid focus:outline-0"
        />
    </div>
    <ul class="px-4">
        <li v-for="recipe of recipes" :key="recipe.id">
            <a
                :href="`/rezepte/${recipe.id}/`"
                class="no-underline hover:underline"
                :style="`view-transition-name: ${recipe.id.replaceAll('_', '__')};`"
                >{{ recipe.data.title }}</a
            >
        </li>
    </ul>
</template>
