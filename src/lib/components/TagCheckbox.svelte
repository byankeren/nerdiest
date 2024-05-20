<script lang="ts">
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { Label } from "$lib/components/ui/label";
	  import { Tags } from 'lucide-svelte';
    
    export let form: any;
    export let tags;

    function addItem(id: string) {
        form.tags = [...form.tags, id];
    }
 
    function removeItem(id: string) {
        form.tags = form.tags.filter((i: any) => i !== id);
    }

</script>
<div class="flex gap-2 px-2 flex-wrap">
    <Tags class="rotate-90"/>
    {#each tags as item}
    {@const checked = form.tags.includes(item.id)}
      <div class="flex items-start ">
          <Checkbox
            id={item.name}
            {checked}
            onCheckedChange={(v) => {
              if (v) {
                addItem(item.id);
              } else {
                removeItem(item.id);
              }
            }}
          >{item.name}</Checkbox>
          <input
            hidden
            type="checkbox"
            name="tags"
            bind:value={item.id}
            {checked}
          />
      </div>
    {/each}
</div>