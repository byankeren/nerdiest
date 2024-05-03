<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from "$lib/components/ui/button/index.js";
	import { Toaster, toast } from 'svelte-sonner'	
	import { LoaderCircle } from 'lucide-svelte';
    import * as Avatar from "$lib/components/ui/avatar";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
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
                    <Avatar.Image src={`/${post.author.avatarUrl}.png`} alt="Profile" />
                    <Avatar.Fallback>CN</Avatar.Fallback>
                </Avatar.Root>
                {post.author.name}
            </div>
            <div class=" flex justify-between items-center">
                {post.content}
                <!-- {} -->
                {#if data.user.id == post.author.id}
                <AlertDialog.Root>
                    <AlertDialog.Trigger>
                        <button type="button" class="bg-primary rounded-md text-white border-2 px-2 py-1">Delete</button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content>
                      <AlertDialog.Header>
                        <AlertDialog.Title>Are Wanna Delete This Folks?</AlertDialog.Title>
                        <AlertDialog.Description>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </AlertDialog.Description>
                      </AlertDialog.Header>
                      <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <form method="POST" action='?/deletePost&id={post.id}' use:enhance class="">
                            <Button type="submit" class="w-full">Delete</Button>
                        </form>
                      </AlertDialog.Footer>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                {/if}
            </div>
        </div>
        {/each}
    {/if}
</div>
