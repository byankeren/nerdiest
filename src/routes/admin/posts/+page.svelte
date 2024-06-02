<script lang="ts">
    import { superForm } from 'sveltekit-superforms';

    import * as Table from "$lib/components/ui/table/index.js";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button/index.js";

    import DetailPage from './[id]/+page.svelte';
    import EditPage from './edit/[id]/+page.svelte';

    export let data;

    import { goto, preloadData, pushState } from '$app/navigation';
	  import { page } from '$app/stores';
	  import Loading from '$lib/components/svg/Loading.svelte';

    const {form, errors, enhance, delayed, message } = superForm(data.form)

    async function postDetail(e: MouseEvent & {currentTarget: HTMLAnchorElement}) {
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
    let detailDialogOpen = false;
	  $: if ($page.state.post) {
		    detailDialogOpen = true;
	  } else {
		    detailDialogOpen = false;
	  }
    async function postEdit(e: MouseEvent & {currentTarget: HTMLAnchorElement}) {
      if (e.metaKey || e.ctrlKey) {
        return
      }
      e.preventDefault()
      const { href } = e.currentTarget
      const result = await preloadData(href)
      if(result.type === 'loaded' && result.status === 200){
        pushState(href, { postEdit: result.data, profile: undefined })
      } else{
        goto(href);
      }
    }
    let editDialogOpen = false;
	  $: if ($page.state.postEdit) {
		    editDialogOpen = true;
	  } else {
		    editDialogOpen = false;
	  }
</script>
  
<Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>No</Table.Head>
        <Table.Head>Author</Table.Head>
        <Table.Head>Content</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each data.posts as post, i (post.id)}
        <Table.Row>
            <Table.Cell>
                {i+1}
            </Table.Cell>
            <Table.Cell class="flex items-center gap-2">
              <Avatar.Root>
                  <Avatar.Image src={`/profile/${post.author.avatarUrl}`} alt="Profile" />
                  <Avatar.Fallback>A</Avatar.Fallback>
              </Avatar.Root>
                {post.author.name}
                {post.id}
            </Table.Cell>
            <Table.Cell>
                <a href={`posts/${post.id}`} on:click={postDetail} class="bg-sky-200 rounded-md px-2 py-1">
                  Detail
                </a>
                <a href={`posts/edit/${post.id}`} on:click={postEdit} class="bg-green-200 rounded-md px-2 py-1">
                  Edit
                </a>
                <AlertDialog.Root>
                  <AlertDialog.Trigger class="bg-red-500 text-white rounded-md px-2 py-1">
                    Delete
                  </AlertDialog.Trigger>
                    <AlertDialog.Content class="md:w-[30%]">
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
            </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
</Table.Root>

  <AlertDialog.Root open={detailDialogOpen}
    onOpenChange={(open) => {
      if (!open) {
          history.back();
        }
      }}>
      <AlertDialog.Content class="w-[95%] md:w-[30%]">
      <DetailPage data={$page.state.post}/>
        <AlertDialog.Footer>
          <AlertDialog.Cancel class="w-full">Cancel</AlertDialog.Cancel>
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
      <EditPage data={$page.state.postEdit}/>
        <AlertDialog.Footer>
          <AlertDialog.Cancel class="w-full">Cancel</AlertDialog.Cancel>
        </AlertDialog.Footer>
      </AlertDialog.Content>
  </AlertDialog.Root>