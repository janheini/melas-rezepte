<script setup lang="ts">
import { SunIcon, MoonIcon } from "lucide-vue-next";
import { ref, onMounted } from "vue";

const darkMode = ref(true);

onMounted(() => {
    if ("theme" in localStorage && localStorage.theme === "light") {
        darkMode.value = false;
    }
});

function toggleDarkMode() {
    darkMode.value = !darkMode.value;
    if (darkMode.value) {
        localStorage.theme = "dark";
        document.documentElement.classList.add("dark");
    } else {
        localStorage.theme = "light";
        document.documentElement.classList.remove("dark");
    }
}
</script>

<template>
    <div class="flex" @click.prevent="toggleDarkMode()">
        <SunIcon v-if="darkMode" class="mr-2 h-4 w-4" />
        <MoonIcon v-if="!darkMode" class="mr-2 h-4 w-4" />
        <div v-if="darkMode">Light Mode</div>
        <div v-if="!darkMode">Dark Mode</div>
    </div>
</template>
