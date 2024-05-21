<script>
	import { enhance } from "$app/forms";
	import {Input} from "$lib/components/ui/input"
  import { Button } from "$lib/components/ui/button";

  import { Reply } from 'lucide-svelte';
  import * as Avatar from "$lib/components/ui/avatar";
  export let comments;
  export let formBind;
</script>
  
<div class="grid gap-5">
{#each comments as comment (comment.id)}
    <div class="border-l-2 border-primary px-4 border-dashed grid grid-cols-[1.5fr_7fr] md:grid-cols-[1fr_7fr] gap-2">
      <div class="flex items-start gap-2">
        <Avatar.Root>
          <Avatar.Image src={`/${comment.author.avatarUrl}.png`} alt="Profile" />
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
      </div>
      <div class="grid gap-2">
        <p class="underline font-semibold">
          {comment.author.name}
        </p>
        <p>{comment.content}</p>
        <Button on:click={() => comment.open = !comment.open} variant="outline" size="sm" class="w-1/2">
          Reply
          <Reply/>
        </Button>
        <!-- <button on:click={() => comment.open = !comment.open}>Reply</button> -->
        {#if comment.open}
        <form method="POST" use:enhance action="?/postReply&post_id={comment.postId}&reply_id={comment.commentRepliedId === null ? comment.id : comment.commentRepliedId}" class="grid gap-2">
          <Input
              type="text"
              placeholder=""
              name="content"
              bind:value={formBind}
              floatLabel="Type Your content."
          />
          <Button size="sm">
            Submit
            <Reply/>
          </Button>
        </form>
        {/if}
      </div>
    </div>
      {#if comment.children && comment.children.length > 0}
          <div class="ml-4">
            <svelte:self comments={comment.children} bind:formBind={formBind}/>            
          </div>
      {/if}
{/each}
</div>
