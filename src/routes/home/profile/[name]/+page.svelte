<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar";
    export let data;
</script>

<div class="grid gap-2">
    <div class="flex items-center gap-2">
        <Avatar.Root>
            {#if post.author.avatarUrl.split('-')[0] == 'avatar'}
                <Avatar.Image src={`/profile/${post.author.avatarUrl}`} alt="Profile" />
            {/if}
            <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
        {data.profile[0].name}
    </div>
    <div>
        Joined at: 
        {data.profile[0].createdAt.split(' ')[0]}
    </div>
</div>

