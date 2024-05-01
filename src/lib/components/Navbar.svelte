<script lang="ts">
	export let user;
    import { enhance } from '$app/forms';
</script>


<header class="flex justify-between items-center py-8 px-4 md:px-0 text-primary bg-transparent">
    <a href="/" class="text-2xl font-black">_.Nerd</a>
    <nav class="">
        {#if user == null}
            <a href="/login" class="border-[3px] border-primary py-2 text-xs px-4 font-bold rounded-xl shadow-[0px_4px] hover:shadow-[0px_2px]">Login</a>
        {:else if user != null}
            <form method="post" action='?/logout' use:enhance>
                <button class="bg-primary py-2 text-sm px-4 rounded text-white">Logout</button>
            </form>
            <p>
                Hello,
                {user.name}
            </p>
        {/if}
    </nav>
</header>