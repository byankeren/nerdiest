<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from "$lib/components/ui/button/index.js";
	import OAuth from "$lib/components/OAuth.svelte";
	import { Toaster, toast } from 'svelte-sonner'	
	import Loading from '$lib/components/svg/Loading.svelte'
    export let data;

    const {form, errors, enhance, delayed, message } = superForm(data.form, {
        onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;

			if (alertType === 'error') {
				toast.error(alertText);
			}
			if (alertType === 'email') {
				toast.error(alertText);
			}
		}
    })

</script>

<Toaster position="top-center" closeButton/>

<form method="POST" use:enhance action="?/register" class="px-4 w-full md:w-[65%] grid gap-2">
    <Input id="name"
        type="text"
        placeholder=""
        bind:value={$form.name}
        name="name"
		labelText="Name."
		floatLabel="Type Your name."
		miniText="Your Email."
    />
    <Input id="email"
        type="email"
        placeholder=""
        bind:value={$form.email}
        name="email"
		labelText="Email."
		floatLabel="Type Your Email."
		miniText="Your Email."
    />
	<Input id="password"
        type="password"
        placeholder=""    
        bind:value={$form.password}
        name="password"
		labelText="Password."
		floatLabel="Type Your Password."
		miniText="Must be at least 10 characters long"
		minlength="10"
    />
	<Button type="submit" disabled={$delayed}>
		{#if $delayed}
			<Loading/>
		{/if}
		Register
	</Button>
	<div class="flex items-center">
		<div class="flex-grow mr-3 border-t border-gray-500"></div>
		<div>Or</div>
		<div class="flex-grow ml-3 border-t border-gray-500"></div>
	</div>	
	<OAuth disabledButton={$delayed}/>
	<p class="mt-2 font-semibold w-full text-end">
		Have Account ?
		<a href="/login" class="underline font-bold"> Login</a>
	</p>
</form>
