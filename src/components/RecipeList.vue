<script setup lang="ts">
import { ref } from "vue";
import { Switch } from "@headlessui/vue";

type RecipeListEntry = {
    slug: string;
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
const filters = ref<Array<z.infer<typeof tags>>>([]);

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
        <Switch
            id="{tag}"
            v-for="tag in props.tags"
            :default-checked="false"
            @update:model-value="(value) => filter(tag, value)"
            v-slot="{ checked }"
        >
            <div
                class="rounded-full border border-gray-300 px-2 py-1"
                :class="{
                    'dark:border-white dark:bg-white dark:text-black': checked,
                    'border-gray-300 bg-gray-300 text-black': checked,
                }"
            >
                {{ tag }}
            </div>
        </Switch>
    </div>
    <ul class="p-4">
        <li v-for="recipe of recipes" :key="recipe.slug">
            <a
                :href="`/rezepte/${recipe.slug}/`"
                class="no-underline hover:underline dark:text-gray-300"
                >{{ recipe.data.title }}</a
            >
        </li>
    </ul>
</template>
