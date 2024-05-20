<script lang="ts">
	import { superForm } from 'sveltekit-superforms';	
	import { Input } from '$lib/components/ui/input/index.js';
	import Loading from '$lib/components/svg/Loading.svelte'
	import {
    	Button,
  	} from "$lib/components/ui/button/index.js";

	import { Toaster, toast } from 'svelte-sonner'	
	export let data;

	const {
		form,
		errors,
		enhance,
		delayed,
		message
	} = superForm(data.form, {
        onUpdated: () => {
			if (!$message) return;
			const { alertType, alertText } = $message;
			if (alertType === 'error') {
				toast.error(alertText);
			}
		}
    });
</script>

<Toaster position="top-center" closeButton/>
<form method="POST" use:enhance action="?/createTag" class="grid gap-2">
	<Input 
		id="content"
        type="text"
        placeholder=""
        bind:value={$form.name}
        name="name"
		labelText="Content."
		floatLabel="Type Your Content."
		miniText="Your Content."
    />
	<Button type="submit">
		Edit
	</Button> 
</form>