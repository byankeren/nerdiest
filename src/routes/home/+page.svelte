<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
  import { Button } from "$lib/components/ui/button/index.js";
  import { Toaster, toast } from 'svelte-sonner'	
  import { Input } from "$lib/components/ui/input";
  import Loading from "$lib/components/svg/Loading.svelte"
  import HeartOutline from "$lib/components/svg/HeartOutline.svelte"
  import HeartFilled from "$lib/components/svg/HeartFilled.svelte"
  import * as Avatar from "$lib/components/ui/avatar";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';
  import ProfilePage from './profile/[name]/+page.svelte';
  import EditPage from './(posts)/edit/[id]/+page.svelte';
	import BubbleText from '$lib/components/svg/BubbleText.svelte';
	import Trash from '$lib/components/svg/Trash.svelte';
	import Edit from '$lib/components/svg/Edit.svelte';
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";
  export let data;

    const {form, errors, enhance, delayed, message } = superForm(data.form,  {		
		onUpdated: () => {
			if (!$message) return;
			const { alertType, alertText } = $message;
			if (alertType === 'error') {
				toast.error(alertText);
			}
	  }})

    async function checkProfile(e: MouseEvent & {currentTarget: HTMLAnchorElement}) {
      if (e.metaKey || e.ctrlKey) {
        return
      }
      e.preventDefault()
      const { href } = e.currentTarget
      const result = await preloadData(href)
      if(result.type === 'loaded' && result.status === 200){
        pushState(href, { profile: result.data })
      } else{
        goto(href);
      }
    }
    async function updatePost(e: MouseEvent & {currentTarget: HTMLAnchorElement}) {
      if (e.metaKey || e.ctrlKey) {
        return
      }
      e.preventDefault()
      const { href } = e.currentTarget
      const result = await preloadData(href)
      if(result.type === 'loaded' && result.status === 200){
        pushState(href, { post: result.data })
      } else{
        goto(href);
      }
    }
    let profileDialogOpen = false;
	  $: if ($page.state.profile) {
	  	  profileDialogOpen = true;
	  } else {
	  	  profileDialogOpen = false;
	  }
    let editDialogOpen = false;
	  $: if ($page.state.post) {
	  	  editDialogOpen = true;
	  } else {
	  	  editDialogOpen = false;
	  }
  function addItem(id: string) {
    $form.tags = [...$form.tags, id];
  }
 
  function removeItem(id: string) {
    $form.tags = $form.tags.filter((i) => i !== id);
  }
</script>

<Toaster position="top-center" closeButton/>
<form method="POST" use:enhance action="?/createPost" class="px-4 w-full md:w-[65%] grid gap-2 mx-auto">
    <Input id="content"
        type="content"
        placeholder=""
        bind:value={$form.content}
        name="content"
		    labelText="content."
		    floatLabel="Type Your Content."
		    miniText="Your Content."
    />
    <div class="flex gap-2">
    {#each data.displayTags as item}
    {@const checked = $form.tags.includes(item.id)}
    <div class="flex items-start">
        <Label for={item.name} class="bg-primary text-[#fafafa] h-full px-4 flex items-center rounded-tl-md rounded-bl-md">{item.name}</Label>
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
          class="rounded-tr-md rounded-br-md border-y-2 border-r-2"
        >a</Checkbox>
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

	<Button type="submit" disabled={$delayed}>
		{#if $delayed}
		<Loading class="animate-spin"/>
		{/if}
		Add
	</Button>	
</form>

<div class="mx-auto md:w-[65%] mb-20">
  {#if data.displayPosts}
      {#each data.displayPosts as post (post.id)}
      <div class="mt-5 border-b-2 py-4 mx-4 border-primary grid gap-4">
          <div class="flex justify-between items-center">
            <div class="flex gap-2 items-center">
              <Avatar.Root>
                {#if post.author.avatarUrl.split('-')[0] == 'avatar'}
                      <Avatar.Image src={`/${post.author.avatarUrl}.png`} alt="Profile" />
                  {/if}
                  <Avatar.Fallback>A</Avatar.Fallback>
              </Avatar.Root>
              <a href={`home/profile/${post.author.name}`} on:click={checkProfile} class="underline font-bold">
                {post.author.name}
              </a>
            </div>
            <div class="flex gap-4">
              {#if data.user.id == post.author.id || data.user.isAdmin}
              <a href={`home/edit/${post.id}`} on:click={updatePost} class="underline font-bold">
                <Edit/>
              </a>
              <!--  -->
              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Trash/>
                </AlertDialog.Trigger>
                  <AlertDialog.Content>
                    <AlertDialog.Header>
                      <AlertDialog.Title>Are Wanna Delete This Folks?</AlertDialog.Title>
                      <AlertDialog.Description>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                      <form method="POST" action='?/deletePost&id={post.id}' use:enhance class="">
                          <Button type="submit" class="w-full">
                              {#if $delayed}
                                <Loading/>
                              {/if}
                              Delete
                          </Button>
                      </form>
                    </AlertDialog.Footer>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              {/if}
            </div>
          </div>
          <div class="grid gap-4">
              <div>
                {post.content}
              </div>
              {#if post.postsToTags !== null}
                <div class="flex gap-2">
                  {#each post.postsToTags as tag}
                  <div>
                    #{tag.tag.name}
                  </div>
                  {/each}
                </div>
              {/if}
              <div class="flex gap-4">
                <div class="flex gap-1">
                  <a href={`home/detail/${post.id}`} class="underline font-bold">
                    <BubbleText/>
                  </a>
                  <p class="font-semibold">{post.totalComments}</p>
                </div>
                <form method="POST" action='?/like&id={post.id}' use:enhance class="flex items-center gap-1">
                  {#if post.likedByCurrentUser}
                    <button>
                      <HeartFilled/>
                    </button>
                  {:else}
                    <button>
                      <HeartOutline/>
                    </button>
                  {/if}
                  <p class="font-semibold">
                    {post.likes.length}
                  </p>
                </form>
            </div>
        </div>
      </div>
      {/each}
      <AlertDialog.Root open={profileDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
            history.back();
          }
        }}>
          <AlertDialog.Content class="w-[95%]">
          <ProfilePage data={$page.state.profile} />
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>

      <AlertDialog.Root open={editDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
            history.back();
          }
        }} class="w-full">
          <AlertDialog.Content class="w-[95%]">
          <EditPage data={$page.state.post}/>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
  {/if}
</div>
