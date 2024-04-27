<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { Mail , LockKeyhole, UserRound } from 'lucide-svelte';
    import Input from '$lib/components/form/Input.svelte';
    
    export let data;

    const {form, errors, enhance } = superForm(data.form, {resetForm: true})

</script>
<form method="POST" use:enhance action="?/register" class="px-4 w-full md:w-[65%] grid">
    <h1 class="font-bold md:text-xl text-3xl">Start Your <br>Nerd Journey.</h1>
    <p class="mb-7 mt-2 text-sm">We've Been Missing You</p>
    <Input
        type="text"
        label="username"
        placeholder="username"    
        bind:value={$form.username}
        errorMessage={$errors.username}
        name="username"
    >
        <UserRound size={22}/>    
    </Input>
    <Input
        type="text"
        label="Email"
        placeholder="example@example.com"    
        bind:value={$form.email}
        errorMessage={$errors.email}
        name="email"
    >
        <Mail size={22}/>
    </Input>
    <Input
        type="text"
        label="password"
        placeholder="password"    
        bind:value={$form.password}
        errorMessage={$errors.password}
        name="password"
    >
        <LockKeyhole size={22}/>
    </Input>
    
    <button class="bg-primary py-2 px-4 text-white rounded-sm mt-3">Submit</button>
    <div class=" inset-0 flex items-center justify-center my-5">
        <div class="border-b border-gray-400 w-full"></div>
        <div class="px-2 bg-white text-gray-700">Awikwok</div>
        <div class="border-b border-gray-400 w-full"></div>
      </div>
      <div>
          google
          Github
        </div>
    <div class="mt-1 text-end">Have Account?
        <a href="/login" class="underline font-bold">
            Login
        </a>
    </div>
</form>
