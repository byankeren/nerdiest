<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";

    import * as Avatar from "$lib/components/ui/avatar";
    import * as RadioGroup from "$lib/components/ui/radio-group";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

    import Loading from "$lib/components/svg/Loading.svelte"

    export let data;
    
    const {form, enhance, delayed} = superForm(data.form);

</script>

<main class="w-1/2 mx-auto">
    <!-- <SuperDebug data={$form} /> -->
    <div class="flex gap-2 pt-10">
    <Avatar.Root>
        <Avatar.Image src={$form.avatar == '' ? `/profile/${data.user.avatarUrl}` : `/profile/${$form.avatar}`} alt="Profile" />
        <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline">Change Avatar</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-56">
        <DropdownMenu.Label>Choose Your Avatar</DropdownMenu.Label>
        <DropdownMenu.Separator />
            <DropdownMenu.RadioGroup class="px-2 py-2">
                  <RadioGroup.Root bind:value={$form.avatar} class="grid grid-cols-2 ">
                      {#each data.profilePictures as profile, i (i)}
                        <div class="flex items-center space-x-2">
                            <Label for={profile}>
                                <Avatar.Root>
                                    <Avatar.Image src={`/profile/${profile}`} alt="Profile" />
                                    <Avatar.Fallback>CN</Avatar.Fallback>
                                </Avatar.Root>
                            </Label>
                            <RadioGroup.Item value={profile} id={profile}/>
                        </div>
                      {/each}
                  </RadioGroup.Root>
            </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
    </div>

    <form method="POST" class="py-4 grid gap-4" use:enhance>
        <input bind:value={$form.avatar} name="avatar" class="hidden"/>
            <Input
                id="Name"
                name="name"
                placeholder="your Name"
                labelText="Name."
                floatLabel="Type Your Name."
                miniText="Your Content."
                bind:value={$form.name}
            />
        <Button disabled={$delayed}>
            {#if $delayed}
                <Loading class="animate-spin"/>
            {/if}
            Edit
        </Button>
    <form/>

</main>