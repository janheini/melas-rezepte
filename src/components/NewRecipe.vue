<script setup lang="ts">
import { ref } from "vue";
import { tags } from "../content/config";
import { Switch } from "@headlessui/vue";
import { z } from "astro:content";
import { PlusCircleIcon } from "@heroicons/vue/24/solid";

type IngredientList = {
    title: string;
    ingredients: Array<string>;
};

export type Recipe = {
    title: string;
    tagList: Array<z.infer<typeof tags>>;
    ingredientList: Array<IngredientList>;
    instructions: string;
};

const title = ref("");
const tagList = ref<Array<z.infer<typeof tags>>>([]);
const ingredientList = ref<Array<IngredientList>>([
    { title: "", ingredients: [""] },
]);
const instructions = ref("");
const titleError = ref("");

function toggleTag(name: z.infer<typeof tags>, state: boolean) {
    if (state == false) {
        tagList.value.splice(tagList.value.indexOf(name), 1);
    }
    if (state == true) {
        tagList.value.push(name);
    }
}

async function save() {
    titleError.value = "";
    if (!(title.value.length > 0)) {
        titleError.value = "Titel fehlt";
    }
    const recipe: Recipe = {
        title: title.value,
        tagList: tagList.value,
        ingredientList: ingredientList.value,
        instructions: instructions.value,
    };
    const response = fetch("", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
    });
    console.log(await response);
}
</script>

<template>
    <div class="prose grid max-w-md gap-4 pb-40 dark:prose-invert">
        <h2>Neues Rezept erstellen</h2>
        <input
            class="border p-1 pl-2 font-black dark:bg-black"
            v-model="title"
            placeholder="Titel"
            :class="{ 'border-red-600': titleError.length > 0 }"
        />
        <div class="flex flex-wrap gap-5 gap-y-6">
            <Switch
                v-for="tag in tags.options"
                :default-checked="false"
                @update:model-value="(value) => toggleTag(tag, value)"
                v-slot="{ checked }"
            >
                <div
                    class="rounded-full border border-gray-300 px-2 py-1"
                    :class="{
                        'dark:border-white dark:bg-white dark:text-black':
                            checked,
                        'border-gray-300 bg-gray-300 text-black': checked,
                    }"
                >
                    {{ tag }}
                </div>
            </Switch>
        </div>
        <div>
            <div
                v-for="(iList, index) in ingredientList"
                class="flex flex-col gap-2 py-2"
            >
                <div class="flex flex-col gap-2">
                    <div class="flex gap-2">
                        <input
                            class="grow border p-1 pl-2 dark:bg-black"
                            v-model="iList.title"
                            placeholder="Titel (leer für einfache Liste)"
                        />
                        <button
                            v-if="index === ingredientList.length - 1"
                            @click="
                                ingredientList.push({
                                    title: '',
                                    ingredients: [''],
                                })
                            "
                        >
                            <PlusCircleIcon class="h-5 w-5" />
                        </button>
                    </div>
                    <div class="flex flex-col gap-2 pl-4">
                        <div
                            class="flex gap-2"
                            v-for="(item, index) in iList.ingredients"
                        >
                            <input
                                class="grow border p-1 pl-2 dark:bg-black"
                                placeholder="Zutat"
                                v-model="iList.ingredients[index]"
                                @keyup="
                                    () => {
                                        if (
                                            index ===
                                                iList.ingredients.length - 1 &&
                                            item.length > 0
                                        ) {
                                            iList.ingredients.push('');
                                        }
                                    }
                                "
                            />
                            <button
                                v-if="index === iList.ingredients.length - 1"
                                @click="iList.ingredients.push('')"
                            >
                                <PlusCircleIcon class="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <textarea
            class="min-h-80 border p-2 leading-snug dark:bg-black"
            v-model="instructions"
            placeholder="Anleitung"
        />
        <button class="mt-4 w-full border p-1" @click="save">Speichern</button>
        <div class="font-black text-red-600">{{ titleError }}</div>
    </div>
</template>
