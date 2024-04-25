<script lang="ts">
    import "../app.css";
	export let data;
    import Navbar from "$lib/components/Navbar.svelte";
</script>

<div class="app max-w-3xl mx-auto font-primary text-primary">

    <header class="flex justify-between py-8 px-4 md:px-0 text-primary">
        <h2 class="text-2xl font-black">_.Nerd</h2>
        {#if !data.isUserLoggedIn}
        <nav class="">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        </nav>
        {:else if data.isUserLoggedIn}
            <form method="post" action='?/logout'>
                <button>Logout</button>
            </form>
        {/if}
    </header>
    <slot />
</div>