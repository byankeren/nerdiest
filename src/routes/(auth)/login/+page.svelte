<script lang="ts">
	import { superForm } from 'sveltekit-superforms';	
	import { Input } from '$lib/components/ui/input/index.js';
	import OAuth from "$lib/components/OAuth.svelte";
	import {
    	Button,
    	buttonVariants
  	} from "$lib/components/ui/button/index.js";

	import { Toaster, toast } from 'svelte-sonner'	
	import { LoaderCircle } from 'lucide-svelte';
	export let data;

	const {
		form: loginForm,
		errors: loginErrors,
		enhance: loginEnhance,
		delayed: loginDelayed,
		message: loginMessage
	} = superForm(data.loginForm, {		
		onUpdated: () => {
			if (!$loginMessage) return;

			const { alertType, alertText } = $loginMessage;

			if (alertType === 'error') {
				toast.error(alertText);
			}
			if (alertType === 'emailAndPass') {
				toast.error(alertText);
			}
		}
	});
</script>

<Toaster position="top-center" closeButton/>
<form method="POST" use:loginEnhance action="?/login" class="px-4 w-full md:w-[65%] grid gap-2">
	<Input 
		id="email"
        type="email"
        placeholder=""
        bind:value={$loginForm.email}
        name="email"
		labelText="Email."
		floatLabel="Type Your Email."
		miniText="Your Email."
    />
	<Input 
		id="password"
        type="password"
        placeholder=""    
        bind:value={$loginForm.password}
        name="password"
		labelText="Password."
		floatLabel="Type Your Password."
		miniText="Your Password."
    />
	<Button type="submit" disabled={$loginDelayed}>
		{#if $loginDelayed}
		<LoaderCircle class="animate-spin"/>
		{/if}
		Login
	</Button>
	<div class="flex items-center">
		<div class="flex-grow mr-3 border-t border-gray-500"></div>
		<div>Or</div>
		<div class="flex-grow ml-3 border-t border-gray-500"></div>
	</div>	
	<OAuth />
	
	<p class="mt-2 font-semibold w-full text-end">
		Dont Have Account ?
		<a href="/register" class="underline font-bold"> register</a>
	</p>
</form>

