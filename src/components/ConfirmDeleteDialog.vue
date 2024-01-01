<script setup lang="ts">
import { ref } from "vue";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
} from "@headlessui/vue";
import { store } from "@/components/store";

async function deleteRecipe() {
    const response = await fetch("", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    error.value = (await response.json()).response.data.message;
    if (response.redirected) {
        window.location.assign(response.url);
    }
}

const error = ref("");
</script>
<template>
    <Dialog
        :open="store.confirmDeleteDialogVisible"
        @close="store.confirmDeleteDialogVisible = false"
    >
        <div
            class="prose fixed inset-y-1/2 z-50 flex items-center justify-center dark:prose-invert"
        >
            <DialogPanel
                class="w-full rounded-md border bg-white p-4 shadow dark:bg-black"
            >
                <DialogTitle class="m-0 p-0">Rezept löschen</DialogTitle>
                <DialogDescription>
                    Das Rezept wird entgültig gelöscht.
                </DialogDescription>
                <div class="flex gap-4">
                    <button
                        class="rounded-md border border-red-600 p-1"
                        @click="
                            () => {
                                deleteRecipe();
                                store.confirmDeleteDialogVisible = false;
                            }
                        "
                    >
                        Löschen
                    </button>
                    <button
                        class="rounded-md border p-1"
                        @click="store.confirmDeleteDialogVisible = false"
                    >
                        Abbrechen
                    </button>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
    <div v-if="error !== ''" class="font-black text-red-600">{{ error }}</div>
</template>
