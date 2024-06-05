<script lang="ts">
	import { superForm } from 'sveltekit-superforms';	
	import { Input } from '$lib/components/ui/input/index.js';
	import { Checkbox } from "$lib/components/ui/checkbox";

	import {
    	Button,
  	} from "$lib/components/ui/button/index.js";

	import { Toaster } from 'svelte-sonner'	
	export let data;

	const {
		form: formEdit,
		errors: errorsEdit,
		enhance: enhanceEdit,
		delayed: delayedEdit,
		message: messageEdit
	} = superForm(data.editForm, {
  		dataType: 'json'
	});

	function addItem(id: string, index) {
		$formEdit.postsToTags[index] = { id } 
    }

    function removeItem(id: string, index) {
		$formEdit.postsToTags[index] = {} 
    }
</script>

<Toaster position="top-center" closeButton/>
<form method="POST" use:enhanceEdit action="?/edit" class="grid gap-2">
	<Input
	id="content"
	type="text"
	placeholder=""
	bind:value={$formEdit.content}
	name="content"
	labelText="Cntent."
	floatLabel="Type Your Content."
	miniText="Your Content."
	/>
    <div class="flex items-center gap-2">
		{#each data.tags as item, i (item.id)}
    	{@const checked = $formEdit?.postsToTags[i]?.tagId?.includes(item.id)}
    	    <Checkbox
				{checked}
    	        id={item.id}
				onCheckedChange={(v) => {
					if (v) {
						addItem(item.id, i)
					} else {
						removeItem(item.id, i)
					}
				}}
    	    >{item.name}</Checkbox>
    	    	<input
				hidden
    	        type="checkbox"
    	        name="tags"
    	        bind:value={ $formEdit.postsToTags }
    	        {checked}
    	    />
    	{/each}
    </div>
	<div class="flex justify-end gap-2">
		<slot/>
		<Button type="submit">
			Edit
		</Button> 
	</div>
</form>