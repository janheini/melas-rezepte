<script setup lang="ts">
import { ref } from "vue";
import { Switch } from "@headlessui/vue";
import { PlusCircleIcon } from "@heroicons/vue/24/solid";
import { store } from "@/components/store";

type IngredientList = {
    title: string;
    ingredients: string[];
};

type Recipe = {
    title: string;
    tagList: string[];
    ingredientList: IngredientList[];
    instructions: string;
};

const props = defineProps<{
    tags: string[];
    recipe?: CollectionEntry<"rezepte">; // TODO: this needs a different type
}>();

// initial values / no prop
const heading = ref("Neues Rezept");
const title = ref("");
const tagList = ref<Array<string>>([]);
const ingredientList = ref<Array<IngredientList>>([
    { title: "", ingredients: [""] },
]);
const instructions = ref("");
const titleError = ref("");
const genericError = ref("");

function toggleTag(name: string, state: boolean) {
    if (state == false) {
        tagList.value.splice(tagList.value.indexOf(name), 1);
    }
    if (state == true) {
        tagList.value.push(name);
    }
}

// fill from props
if (props.recipe) {
    heading.value = "Rezept ändern";
    title.value = props.recipe.data.title;
    tagList.value = props.recipe.data.tags;
    if (props.recipe.data.ingredients) {
        ingredientList.value = [
            { title: "", ingredients: props.recipe.data.ingredients },
        ];
    } else if (props.recipe.data.ingredientList) {
        ingredientList.value = props.recipe.data.ingredientList;
    }
    for (const list of ingredientList.value) {
        if (list.ingredients.length === 0) {
            list.ingredients = [""];
        }
    }
    instructions.value = props.recipe.body.trim();
}

async function save() {
    titleError.value = "";
    if (title.value.trim() === "") {
        titleError.value = "Titel fehlt";
        return;
    }
    const recipe: Recipe = {
        title: title.value,
        tagList: tagList.value,
        ingredientList: ingredientList.value,
        instructions: instructions.value,
    };
    const response = await fetch("", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
    });
    if (response.redirected) {
        window.location.assign(response.url);
    }
    genericError.value = (await response.json()).response.data.message;
}
</script>

<template>
    <h2>{{ heading }}</h2>
    <input
        class="border p-1 pl-2 font-black dark:bg-black"
        v-model="title"
        placeholder="Titel"
        :class="{ 'border-red-600': titleError.length > 0 }"
    />
    <div class="flex flex-wrap gap-5 gap-y-6">
        <Switch
            id="{tag}"
            v-for="tag in props.tags"
            :default-checked="tagList.indexOf(tag) > -1"
            @update:model-value="(value) => toggleTag(tag, value)"
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
    <button class="w-full border p-1" @click="save">Speichern</button>
    <div v-if="titleError.length > 0" class="font-black text-red-600">
        {{ titleError }}
    </div>
    <div v-if="genericError.length > 0" class="font-black text-red-600">
        {{ genericError }}
    </div>
    <button
        class="w-full border border-red-600 p-1"
        @click="store.confirmDeleteDialogVisible = true"
    >
        Rezept Löschen
    </button>
</template>
