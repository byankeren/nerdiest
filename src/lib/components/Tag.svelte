<script lang="ts">
export let tags

interface typeTag {
    [key: string]: string;
}

const tagClasses: typeTag = {
    Sports: 'text-red-500',
    Tech: 'text-sky-500',
};


</script>

<div class="flex gap-2 w-full">
            <div class="flex gap-1">
                {#each tags as tag}
                    <div class={`font-semibold flex items-center gap-1 px-2 py-[2px] relative text-xs bg-primary text-[#F7F7F7] rounded-md dark:text-[#181818]`}>
                        <span>{tag.tag.name}</span>
                    </div>
                {/each}
            </div>
</div>
