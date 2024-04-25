<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import Input from '$lib/components/form/Input.svelte';
    
    export let data;

    const {form, errors, enhance } = superForm(data.form, {resetForm: true})

</script>
<form method="POST" use:enhance action="?/register" class="mx-4 w-full grid gap-4">
    <Input
        type="text"
        label="username"
        placeholder="username"    
        bind:value={$form.username}
        errorMessage={$errors.username}
        name="username"
    />
    <Input
        type="text"
        label="Email"
        placeholder="example@example.com"    
        bind:value={$form.email}
        errorMessage={$errors.email}
        name="email"
    />
    <Input
        type="text"
        label="password"
        placeholder="********"    
        bind:value={$form.password}
        errorMessage={$errors.password}
        name="password"
    />
    <button class="bg-primary py-2 px-4 text-white rounded-sm">Submit</button>
</form>
