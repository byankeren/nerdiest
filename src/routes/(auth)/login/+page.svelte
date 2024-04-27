<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { Mail , LockKeyhole } from 'lucide-svelte';
    import Input from '$lib/components/form/Input.svelte';
    import Modal from '$lib/components/Modal.svelte';
    
    export let data;

        let showModal = false
    const handleToggleModal = () => {
      showModal = !showModal
    }

    const {form: loginForm, errors: loginErrors, enhance: loginEnhance, delayed: loginDelayed } = superForm(data.loginForm, {resetForm: true})
    
    const {
        form: resetPasswordForm,
        errors: resetPasswordErrors,
        enhance: resetPasswordEnhance,
        delayed: resetPasswordDelayed 
    } = superForm(data.resetPasswordForm, {resetForm: true})
</script>

<button on:click={() => handleToggleModal()}>Open modal</button>
<Modal
  title="Edit your details"
  open={showModal}
  on:close={() => handleToggleModal()}
>
<form method="POST" use:resetPasswordEnhance action="?/sendEmailResetPassword" class="px-4 w-full  md:w-[65%] grid">
    <Input
        type="text"
        label="Email"
        placeholder="example@example.com"    
        bind:value={$resetPasswordForm.email}
        errorMessage={$resetPasswordErrors.email}
        name="email"
    >
        <Mail size={22}/>
    </Input>

    {#if $resetPasswordDelayed}loading...{/if}

    <button class="bg-primary py-2 px-4 text-white mt-3 rounded-sm">Submit</button>
</form>
</Modal>

<form method="POST" use:loginEnhance action="?/login" class="px-4 w-full  md:w-[65%] grid">
    <!-- <h1 class="font-bold md:text-4xl text-3xl">Welcome Back <br>Nerd.</h1>
    <p class="mb-7 mt-2 text-sm">We've Been Missing You</p> -->
    <Input
        type="text"
        label="Email"
        placeholder="example@example.com"    
        bind:value={$loginForm.email}
        errorMessage={$loginErrors.email}
        name="email"
    >
        <Mail size={22}/>
    </Input>
    <Input
        type="text"
        label="password"
        placeholder="password"    
        bind:value={$loginForm.password}
        errorMessage={$loginErrors.password}
        name="password"
    >
        <LockKeyhole size={22}/>
    </Input>

    {#if $loginDelayed}loading...{/if}

    <button class="bg-primary py-2 px-4 text-white mt-3 rounded-sm">Submit</button>

    <div class="mt-1 text-end">Don't Have Account?
            <a href="/register" class="underline font-bold">
                Register
            </a>
    </div>
</form>