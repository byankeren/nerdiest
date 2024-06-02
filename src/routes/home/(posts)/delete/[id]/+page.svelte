<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  
  import { Button } from "$lib/components/ui/button/index.js";  

  import Loading from "$lib/components/svg/Loading.svelte"

  export let data;

  const {form, errors, enhance, delayed, message } = superForm(data.form)
</script>
    <form method="POST" action='?/delete' use:enhance>
      <Button type="submit" class="w-full" disabled={$delayed}>
          {#if $delayed}
            <Loading/>
          {/if}
          Delete
      </Button>
  </form>