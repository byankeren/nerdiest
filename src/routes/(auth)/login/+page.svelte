<script lang="ts">
	import { superForm } from 'sveltekit-superforms';	
	import { Input } from '$lib/components/ui/input/index.js';
	import OAuth from "$lib/components/OAuth.svelte";
	import {
    	Button,
    	buttonVariants
  	} from "$lib/components/ui/button/index.js";
  	import * as Dialog from "$lib/components/ui/dialog/index.js";

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

	const {
		form: resetPasswordForm,
		errors: resetPasswordErrors,
		enhance: resetPasswordEnhance,
		delayed: resetPasswordDelayed,
		message: resetPasswordMessage
	} = superForm(data.resetPasswordForm, { 
		onUpdated: () => {
			if (!$resetPasswordMessage) return;

			const { alertType, alertText } = $resetPasswordMessage;

			if (alertType === 'error') {
				toast.error(alertText);
			}
			if (alertType === 'email') {
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
	<div class="flex items-center mb-1">
		<div class="flex-grow mr-3 border-t border-gray-500"></div>
		<div>Or</div>
		<div class="flex-grow ml-3 border-t border-gray-500"></div>
	</div>	
	<div class="grid grid-cols-[1fr_3fr] gap-2">  	
		<Dialog.Root>
			<Dialog.Trigger>
				<Button type="button">
					Reset Password
				</Button>
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
			  <Dialog.Header>
			  </Dialog.Header>
			  <form method="POST" use:resetPasswordEnhance action="?/sendEmailResetPassword" class="px-4 w-full grid gap-4">
				<Input id="email"
		        type="email"
		        placeholder=""
		        bind:value={$resetPasswordForm.email}
		        name="email"
				labelText="Email."
				floatLabel="Type Your Email."
				miniText="Your Email."
		    />
					<Dialog.Footer>
						<Button type="submit" disabled={$resetPasswordDelayed}>
							{#if $resetPasswordDelayed}
								<LoaderCircle class="animate-spin"/>
							{/if}
							Login
						</Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
		<Button type="submit" disabled={$loginDelayed}>
			{#if $loginDelayed}
			<LoaderCircle class="animate-spin"/>
			{/if}
			Login
		</Button>
	</div>
	<OAuth />
	
	<p class="mt-2 font-semibold w-full text-end">
		Dont Have Account ?
		<a href="/register" class="underline font-bold"> register</a>
	</p>
</form>

