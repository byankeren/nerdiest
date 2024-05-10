<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { Button } from "$lib/components/ui/button/index.js";
  import { Toaster, toast } from 'svelte-sonner'	
  import { Textarea } from "$lib/components/ui/textarea";
  import Loading from "$lib/components/svg/Loading.svelte"
  import HeartOutline from "$lib/components/svg/HeartOutline.svelte"
  import HeartFilled from "$lib/components/svg/HeartFilled.svelte"
  import * as Avatar from "$lib/components/ui/avatar";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import * as Dialog from "$lib/components/ui/dialog";
  import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';
  import ProfilePage from './profile/[name]/+page.svelte';
  import CommentsPage from './(posts)/detail/[id]/+page.svelte';
	import BubbleText from '$lib/components/svg/BubbleText.svelte';
	import Trash from '$lib/components/svg/Trash.svelte';
  export let data;
  const {form, errors, enhance, delayed, message } = superForm(data.form, {
      onUpdated: () => {
        if (!$message) return;

        const { alertType, alertText } = $message;

        if (alertType === 'error') {
          toast.error(alertText);
        }
          }
  })

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
  let profileDialogOpen = false;
	$: if ($page.state.profile) {
		  profileDialogOpen = true;
	} else {
		  profileDialogOpen = false;
	}
</script>

<Toaster position="top-center" closeButton/>

<form method="POST" use:enhance action="?/createPost" class="px-4 w-full md:w-[65%] grid gap-2 mx-auto">
  <Textarea id="content" bind:value={$form.content} name="content"/>
    <Button type="submit" disabled={$delayed}>
      {#if $delayed}
        <Loading />
      {/if}
      Submit
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
              <a href={`home/profile/${post.author.name}`} class="underline font-bold">
                {post.author.name}
              </a>
            </div>
            <div>
              {#if data.user.id == post.author.id}
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
          <AlertDialog.Content class="w-[30%]">
          <ProfilePage data={$page.state.profile} />
            
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
  {/if}
</div>
