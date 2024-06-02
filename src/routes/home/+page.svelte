<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { Button } from "$lib/components/ui/button/index.js";
  import { Toaster, toast } from 'svelte-sonner'	
  import Loading from "$lib/components/svg/Loading.svelte"
  import HeartOutline from "$lib/components/svg/HeartOutline.svelte"
  import HeartFilled from "$lib/components/svg/HeartFilled.svelte"
  import * as Avatar from "$lib/components/ui/avatar";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';

  import ProfilePage from './profile/[name]/+page.svelte';
  import EditPage from './(posts)/edit/[id]/+page.svelte';
  import DeletePage from './(posts)/delete/[id]/+page.svelte';

	import BubbleText from '$lib/components/svg/BubbleText.svelte';
	import Trash from '$lib/components/svg/Trash.svelte';
	import Edit from '$lib/components/svg/Edit.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import TagCheckbox from '$lib/components/TagCheckbox.svelte';
	import { Input } from '$lib/components/ui/input/index.js';


  import { PenTool } from 'lucide-svelte';
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
        pushState(href, { profile: result.data, post: undefined })
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
        pushState(href, { post: result.data, profile: undefined })
      } else{
        goto(href);
      }
    }

    async function deletePost(e: MouseEvent & {currentTarget: HTMLAnchorElement}) {
      if (e.metaKey || e.ctrlKey) {
        return
      }
      e.preventDefault()
      const { href } = e.currentTarget
      const result = await preloadData(href)
      if(result.type === 'loaded' && result.status === 200){
        pushState(href, { postDelete: result.data, profile: undefined })
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

    let deleteDialogOpen = false;
	  $: if ($page.state.postDelete) {
	  	  deleteDialogOpen = true;
	  } else {
	  	  deleteDialogOpen = false;
	  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
</script>

<Toaster position="top-center" closeButton/>

<div class="mx-auto md:w-[65%] px-4">
<AlertDialog.Root>
  <AlertDialog.Trigger class="bg-primary p-2 rounded-full fixed right-5 bottom-5 md:static">
    <PenTool class="text-background"/>
  </AlertDialog.Trigger>
    <AlertDialog.Content class="md:w-[30%]">
      <AlertDialog.Header>
        <AlertDialog.Title>Add Content</AlertDialog.Title>
      </AlertDialog.Header>
      <form method="POST" use:enhance action="?/createPost">
        <div class="grid gap-2">
            <div>
              <Input
              id="content"
              name="content"
              placeholder="your content"
              labelText="Content."
              floatLabel="Type Your Content."
              miniText="Your Content."
              bind:value={$form.content}
              />
            </div>
            <div class=" flex items-center pb-3">
              <TagCheckbox tags={data.displayTags} form={$form}/>
            </div>
        </div>
        <AlertDialog.Footer class="mt-5">
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <Button type="submit" disabled={$delayed}>
            {#if $delayed}
              <Loading class="animate-spin"/>
            {/if}
              Add Content
          </Button>
        </AlertDialog.Footer>
      </form>
    </AlertDialog.Content>
</AlertDialog.Root>
</div>

<div class="mx-auto md:w-[65%] mb-20 px-4">
  {#if data.displayPosts}
      {#each data.displayPosts as post (post.id)}
      <div class="mt-5 border-b-2 py-4 border-primary grid grid-cols-[1.5fr_7fr] md:grid-cols-[1fr_7fr]">
          <div class="flex gap-2 items-start">
            <Avatar.Root>
              {#if post.author.avatarUrl.split('-')[0] == 'avatar'}
                <Avatar.Image src={`/profile/${post.author.avatarUrl}`} alt="Profile" />
              {/if}
                <Avatar.Fallback>A</Avatar.Fallback>
          </Avatar.Root>
          </div>
          <div class="grid gap-2">
              <div class="flex justify-between">
                <a href={`home/profile/${post.author.name}`} on:click={checkProfile} class="underline font-semibold">
                  {post.author.name}
                </a>
                <div class="flex gap-4">
                {#if data.user.id == post.author.id || data.user.isAdmin}
                <a href={`home/edit/${post.id}`} on:click={updatePost} class="underline font-bold">
                  <Edit/>
                </a>
                <a href={`home/delete/${post.id}`} on:click={deletePost} class="underline font-bold">
                  <Trash/>
                </a>
                <!--  -->
                {/if}
              </div>
              </div>
              <div class="line-clamp-2">
                {post.content}
              </div>
              <div class="text-[11px] text-muted-foreground font-medium">
                {months[post.createdAt.split(' ')[0].split('-')[1][1]]}
                { `${post.createdAt.split(' ')[0].split('-')[2]}, ` }
                {post.createdAt.split(' ')[0].split('-')[0]}
              </div>
              <div class="flex gap-4 items-center">
                <div class="flex gap-1">
                  <a href={`home/detail/${post.id}`} class="underline font-bold">
                    <BubbleText/>
                  </a>
                  <p class="font-semibold">{post.totalComments}</p>
                </div>
                <form method="POST" action='?/like&id={post.id}' class="flex items-center gap-1" use:enhance>
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
                <Tag tags={post.postsToTags}/>
            </div>
        </div>
      </div>
      {/each}
      {#if $delayed}
        <div class="absolute top-2 left-2">
          <Loading class="animate-spin"/>
        </div>
      {/if}
      <AlertDialog.Root open={profileDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
            history.back();
          }
        }}>
      <AlertDialog.Content class="w-[95%] md:w-[30%]">
          <ProfilePage data={$page.state.profile} />
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Close</AlertDialog.Cancel>
            </AlertDialog.Footer>
          </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={editDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
            history.back();
          }
        }}>
          <AlertDialog.Content class="w-[95%] md:w-[30%]">
          <EditPage data={$page.state.post}/>
            <AlertDialog.Footer>
              <AlertDialog.Cancel class="w-full">Cancel</AlertDialog.Cancel>
            </AlertDialog.Footer>
          </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={deleteDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
            history.back();
          }
        }}>
          <AlertDialog.Content class="w-[95%] md:w-[30%]">
          <AlertDialog.Header>
            <AlertDialog.Title>Are Wanna Delete This Folks?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <DeletePage data={$page.state.postDelete}/>
            <AlertDialog.Footer>
              <AlertDialog.Cancel class="w-full">Cancel</AlertDialog.Cancel>
            </AlertDialog.Footer>
          </AlertDialog.Content>
      </AlertDialog.Root>
  {/if}
</div>