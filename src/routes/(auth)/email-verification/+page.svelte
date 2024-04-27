<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import Input from '$lib/components/form/Input.svelte';
    
    export let data;

    const {form, errors, enhance } = superForm(data.emailVerifCodeForm)

</script>

<div class="flex flex-col items-center mt-20">  
		<h1 class="mb-6 text-2xl font-bold leading-none">Email Verification Code</h1>
		
		<h2 class="mb-5 text-balance text-center">
			To complete your registration, please enter the verification code we've sent to
			your email:
			<strong>{data.pendingUserEmail}</strong>.
		</h2>

	<form
		use:enhance
		method="post"
		class="w-full px-5 md:w-[65%] grid gap-4"
		action="?/verifyCode"
		>
		<Input
			type="text"
			name="verifCode"
			label="Verification Code"
			className="text-center"
			placeholder="Code"
			bind:value={$form.verifCode}
			errorMessage={$errors.verifCode}
			maxLength="6"
		/>
		<button class="w-full bg-primary text-white rounded-sm py-2">Verify</button>
	</form>

	<form
		method="post"
		action="?/sendNewCode"
		use:enhance
		class="w-full px-5 md:w-[65%] mt-4 grid"
	>
		<button class="w-full bg-primary text-white rounded-sm py-2">Send New Code</button>
	</form>
</div>