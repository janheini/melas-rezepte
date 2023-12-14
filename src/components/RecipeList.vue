<script setup lang="ts">
import { ref, computed } from "vue";
import type { CollectionEntry } from "astro:content";
import { tags } from "../content/config.ts";
import { Toggle } from "@/components/ui/toggle";
import { z } from "astro:content";

const props = defineProps<{
    recipes: CollectionEntry<"rezepte">[];
}>();

const recipes = ref(props.recipes);
const filters = ref<Array<z.infer<typeof tags>>>([]);
const active = ref(false);

function filter(name: z.infer<typeof tags>, state: boolean) {
    if (state == false) {
        filters.value.splice(filters.value.indexOf(name), 1);
    }
    if (state == true) {
        filters.value.push(name);
    }
    recipes.value = props.recipes;
    for (const f of filters.value) {
        recipes.value = recipes.value.filter(
            (recipe) => recipe.data.tags && recipe.data.tags.indexOf(f) > -1,
        );
    }
}
</script>

<template>
    <div class="flex flex-wrap gap-5 gap-y-6">
        <Toggle
            v-for="tag in tags.options"
            v-model:pressed="active"
            @update:pressed="filter(tag, active)"
            class="rounded-full border-2"
            >{{ tag }}</Toggle
        >
    </div>
    <ul class="p-4">
        <li v-for="recipe of recipes" :key="recipe.slug">
            <a
                :href="`/rezepte/${recipe.slug}`"
                class="no-underline hover:underline"
                >{{ recipe.data.title }}</a
            >
        </li>
    </ul>
</template>
