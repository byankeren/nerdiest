<script lang="ts">
	export let user;
</script>


<header class="flex justify-between py-8 px-4 md:px-0 text-primary">
    <h2 class="text-2xl font-black">_.Nerd</h2>
    {#if !user}
    <nav class="">
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    </nav>
    {:else}
        <form method="post" action='?/logout'>
            <button>Logout</button>
        </form>
    {/if}
</header>