<script lang="ts">
    import { actions } from "astro:actions";
    import { navigate } from "astro:transitions/client";
    interface Props {
        slug: string;
        error: string;
    }

    let { slug, error = $bindable() }: Props = $props();

    let confirm = $state(false);
    let text = $derived(confirm ? "Wirklich löschen?" : "Löschen");
</script>

<button
    class={[
        "border w-full border-red-600 hover:cursor-pointer",
        confirm && "bg-red-600",
    ]}
    onclick={async () => {
        if (!confirm) {
            confirm = true;
            return;
        }

        const result = await actions.deleteRecipe(slug);
        if (result.error) {
            error = result.error.message;
            return;
        }

        navigate("/");
    }}
>
    {text}
</button>
