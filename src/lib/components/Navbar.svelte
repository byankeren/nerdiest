<script lang="ts">
	export let user;
    import { enhance } from '$app/forms';
    import * as Avatar from "$lib/components/ui/avatar";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Sun from "lucide-svelte/icons/sun";
    import Moon from "lucide-svelte/icons/moon";
    import { toggleMode } from "mode-watcher";
    import { Separator } from "$lib/components/ui/separator";
</script>


<header class="flex justify-between items-center px-4 md:px-0 text-primary bg-transparent py-4">
    <a href="/" class="text-2xl font-black">_.Nerd</a>
    <nav class="flex items-center h-5 jusitfy-center">
        {#if user == null}
            <a href="/login" class="border-[3px] border-primary py-2 text-xs px-4 font-bold rounded-xl shadow-[0px_4px] hover:shadow-[0px_2px]">Login</a>
        {:else if user != null}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger class="flex items-center gap-2">
                    Hello,
                    {user.name}
                    <Avatar.Root>
                        {#if post.author.avatarUrl.split('-')[0] == 'avatar'}
                            <Avatar.Image src={`/profile/${post.author.avatarUrl}`} alt="Profile" />
                        {/if}
                        <Avatar.Fallback>A</Avatar.Fallback>
                    </Avatar.Root>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Group>
                    <DropdownMenu.Label>
                        <a href="/home/profile/my-profile">
                            My Account
                        </a>
                    </DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Label>
                        <a href="/">Main Page</a>
                    </DropdownMenu.Label>
                    <DropdownMenu.Label>
                        <a href="/home">Home</a>
                    </DropdownMenu.Label>
                    {#if user.isAdmin}
                    <DropdownMenu.Separator />
                    <DropdownMenu.Label>
                        <a href="/admin/tags">Tags</a>
                    </DropdownMenu.Label>
                    <DropdownMenu.Label>
                        <a href="/admin/posts">Posts</a>
                    </DropdownMenu.Label>
                    {/if}
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
        <Separator orientation="vertical" class="mx-2"/>
        <button on:click={toggleMode} variant="ghost" size="icon" class="flex items-center">
            <Sun
              class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
        </button>
    </nav>
</header>