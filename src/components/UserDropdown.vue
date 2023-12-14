<script setup lang="ts">
import { LogOut } from "lucide-vue-next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            class="text-muted-foreground open:text-primary-foreground focus:text-primary-foreground"
            >{{ props.user }}</DropdownMenuTrigger
        >
        <DropdownMenuContent>
            <DropdownMenuItem>
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
        </DropdownMenuContent>
    </DropdownMenu>
</template>
