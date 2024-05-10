<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar";
    export let data;
</script>

<div class="grid gap-2">
    <div class="flex items-center gap-2">
        <Avatar.Root>
            <Avatar.Image src={`/${data.profile[0].avatarUrl}.png`} alt="Profile" />
            <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
        {data.profile[0].name}
    </div>
    <div>
        Joined at: 
        {data.profile[0].createdAt.split(' ')[0]}
    </div>
</div>

