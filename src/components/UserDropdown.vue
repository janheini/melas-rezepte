<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import {
    PencilSquareIcon,
    ArrowRightStartOnRectangleIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps({
    user: {
        type: String,
        required: true,
        readonly: true,
    },
});

async function logout() {
    await fetch("/logout", { method: "POST" });
    window.location.href = "/";
}
</script>

<template>
    <Menu as="div" class="relative">
        <MenuButton id="loginmenu" class="cursor-pointer text-black">{{
            props.user
        }}</MenuButton>
        <MenuItems
            class="absolute right-0 mt-1 min-w-max rounded border border-gray-800 bg-white"
        >
            <MenuItem v-slot="{ active }">
                <a href="/new">
                    <div
                        class="flex items-center gap-2 rounded p-1.5 text-sm"
                        :class="{ 'bg-gray-300 text-black': active }"
                    >
                        <PencilSquareIcon class="h-4 w-4" />
                        Neues Rezept
                    </div>
                </a>
            </MenuItem>
            <MenuItem
                v-slot="{ active }"
                @click="logout"
                class="cursor-pointer"
            >
                <div
                    class="flex items-center gap-2 rounded p-1.5 text-sm"
                    :class="{ 'bg-gray-300 text-black': active }"
                >
                    <ArrowRightStartOnRectangleIcon class="h-4 w-4" />
                    Ausloggen
                </div>
            </MenuItem>
        </MenuItems>
    </Menu>
</template>
