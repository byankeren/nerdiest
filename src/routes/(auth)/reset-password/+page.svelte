<script lang="ts">
	export let data;

    import Input from '$lib/components/form/Input.svelte'
    import { superForm } from 'sveltekit-superforms';
    // import {LockKeyhole} from 'lucide-svelte'

    const {form, errors, enhance, delayed } = superForm(data.form, {resetForm: true})
    import SuperDebug from 'sveltekit-superforms';
    import { page } from '$app/stores';
</script>


{#if !data.passwordResetTokenStatus.isValid}
	<h1 class="mb-5 text-2xl font-bold text-red-600">
		{data.passwordResetTokenStatus.message}
	</h1>
{:else}
	<h1 class="mb-6 text-2xl font-bold leading-none">Reset Password</h1>
<form use:enhance method="POST" action="?/resetPassword">
<SuperDebug data={$form}/>

    <Input
    type="text"
    label="password"
    placeholder="password"    
    bind:value={$form.newPassword}
    errorMessage={$errors.newPassword}
    name="newPassword"
    >

    </Input>
    <div class="hidden">
        <Input
        type=""
        label="token"
        placeholder="token"    
        value={$page.url.searchParams.get('token')}
        name="passwordResetToken"
        >
        </Input>
    </div>
        <button class="bg-primary py-2 px-4 text-white rounded-sm mt-3">Submit</button>
    
    {#if $delayed}loading...{/if}
</form>
{/if}