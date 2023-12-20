<script setup lang="ts">
import { ListPlus, LogOut } from "lucide-vue-next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DarkModeToggle from "@/components/DarkModeToggle.vue";

const props = defineProps({
    user: {
        type: String,
        required: true,
        readonly: true,
    },
});
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger
            class="text-muted-foreground hover:text-foreground"
            >{{ props.user }}</DropdownMenuTrigger
        >
        <DropdownMenuContent>
            <DropdownMenuItem>
                <ListPlus class="mr-2 h-4 w-4" />
                <a href="/new">Neues Rezept</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <LogOut class="mr-2 h-4 w-4" />
                <form method="post" action="/logout">
                    <input
                        class="cursor-pointer"
                        type="submit"
                        value="Ausloggen"
                    />
                </form>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <DarkModeToggle client:load />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
