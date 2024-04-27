<script lang="ts">
	export let user;
</script>


<header class="flex justify-between items-center pt-8 px-4 md:px-0 text-primary">
    <a href="/" class="text-2xl font-black">_.Nerd</a>
    <nav class="">
        {#if user == null}
            <a href="/login" class="border-[3px] border-primary py-2 text-xs px-4 font-bold rounded-xl shadow-[0px_4px] hover:shadow-[0px_2px]">Login</a>
            <!-- <a href="/register" class="bg-primary py-2 text-sm px-4 rounded text-white">Register</a> -->
        {:else if user != null}
            <form method="post" action='?/logout'>
                <button class="bg-primary py-2 text-sm px-4 rounded text-white">Logout</button>
            </form>
        {/if}
    </nav>
</header>