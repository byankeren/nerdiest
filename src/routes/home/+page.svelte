<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from "$lib/components/ui/button/index.js";
	import { Toaster, toast } from 'svelte-sonner'	
	import { LoaderCircle } from 'lucide-svelte';
    import * as Avatar from "$lib/components/ui/avatar";
    import avatar1 from "$lib/assets/avatar-1.png";
    import avatar2 from "$lib/assets/avatar-2.png";
    import avatar3 from "$lib/assets/avatar-3.png";
    import avatar4 from "$lib/assets/avatar-4.png";
    import avatar5 from "$lib/assets/avatar-5.png";

    export let data;

    const {form, errors, enhance, delayed, message } = superForm(data.form)

</script>

<Toaster position="top-center" closeButton/>

<form method="POST" use:enhance action="?/createPost" class="px-4 w-full md:w-[65%] grid gap-2 mx-auto">
    <Input id="content"
        type="content"
        placeholder=""
        bind:value={$form.content}
        name="content"
		labelText="content."
		floatLabel="Type Your content."
		miniText="Your Email."
    />
	<Button type="submit" disabled={$delayed}>
		{#if $delayed}
		<LoaderCircle class="animate-spin"/>
		{/if}
		Add
	</Button>	
</form>

<div class="mx-auto md:w-[65%]">
    {#if data.displayPosts}
        {#each data.displayPosts as post}
        <div class="mt-5 border-b-2 py-4 mx-4 border-primary grid gap-4">
            <div class="flex gap-2 items-center">
                <Avatar.Root>
                    <Avatar.Image src={`/src/lib/assets/${post.author.avatarUrl}.png`} alt="Profile" />
                    <Avatar.Fallback>CN</Avatar.Fallback>
                </Avatar.Root>
                {post.author.name}
            </div>
            <div class="w-fit">
                {post.content}
            </div>
        </div>
        {/each}
    {/if}
</div>
