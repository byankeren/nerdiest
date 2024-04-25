<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import Input from '$lib/components/form/Input.svelte';
    
    export let data;

    const {form, errors, enhance } = superForm(data.emailVerifCodeForm)

</script>

<h1 class="mb-6 text-2xl font-bold leading-none">Email Verification Code</h1>

<h2 class="mb-5">
	Welcome aboard 🎉! To complete your registration, please enter the verification code we've sent to
	your email:
	<strong>{data.pendingUserEmail}</strong>.
</h2>

<form
	use:enhance
	method="post"
	class="space-y-4"
	action="?/verifyCode"
>
	<Input
		type="text"
		name="verifCode"
		label="Verification Code"
		placeholder="Enter your verification code here"
		bind:value={$form.verifCode}
		errorMessage={$errors.verifCode}
	/>

	<button class="w-full">Verify</button>
</form>

<form
	method="post"
	action="?/sendNewCode"
	use:enhance
	class="mt-4"
>
	<button class="w-full">Send New Code</button>
</form>