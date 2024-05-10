<script lang="ts">
	export let user;
    import { enhance } from '$app/forms';
    import * as Avatar from "$lib/components/ui/avatar";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

    let isActive = false;

    function handleClick() {
        isActive = !isActive; // Toggle the isActive state
        console.log('asdasd')
    }
</script>


<header class="flex justify-between items-center px-4 md:px-0 text-primary bg-transparent py-4">
    <a href="/" class="text-2xl font-black">_.Nerd</a>
    <nav class="">
        {#if user == null}
            <a href="/login" class="border-[3px] border-primary py-2 text-xs px-4 font-bold rounded-xl shadow-[0px_4px] hover:shadow-[0px_2px]">Login</a>
        {:else if user != null}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <button type="button" class="flex items-center gap-2 group" on:click={handleClick}>
                        <button class={isActive ? 'rotate-[180deg] transition-all' : 'transition-all'}>
                        </button>
                        Hello,
                        {user.name}
                        <Avatar.Root>
                            <Avatar.Image src={`/${user.avatarUrl}.png`} alt="Profile" />
                            <Avatar.Fallback>CN</Avatar.Fallback>
                        </Avatar.Root>
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Group>
                    <DropdownMenu.Label>My Account</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Label>
                        <a href="/">Main Page</a>
                    </DropdownMenu.Label>
                    <DropdownMenu.Label>
                        <a href="/home">Home</a>
                    </DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>
                        <form method="POST" action='/logout?/logout' use:enhance>
                            <button class="">Logout</button>
                        </form>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
        {/if}
    </nav>
</header>