<script lang="ts">
	import { superForm } from 'sveltekit-superforms';	
	import { Input } from '$lib/components/ui/input/index.js';
	import Loading from '$lib/components/svg/Loading.svelte'
	import OAuth from "$lib/components/OAuth.svelte";
	import {
    	Button,
    	buttonVariants
  	} from "$lib/components/ui/button/index.js";

	import { Toaster, toast } from 'svelte-sonner'	
	export let data;

	const {
		form: formEdit,
		errors: errorsEdit,
		enhance: enhanceEdit,
		delayed: delayedEdit,
		message: messageEdit
	} = superForm(data.editForm);
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
	<Button type="submit">
		Edit
	</Button> 
</form>