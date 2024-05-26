<script lang="ts">
	import { superForm } from 'sveltekit-superforms';	
	import { Input } from '$lib/components/ui/input/index.js';
	import Loading from '$lib/components/svg/Loading.svelte'

	import * as Table from "$lib/components/ui/table/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";

	import EditPage from './edit/[id]/+page.svelte';

	import {
    	Button,
  	} from "$lib/components/ui/button/index.js";
	
	import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';

	import { Toaster, toast } from 'svelte-sonner'	
	export let data;

	const {
		form,
		errors,
		enhance,
		delayed,
		message
	} = superForm(data.form, {
        onUpdated: () => {
			if (!$message) return;
			const { alertType, alertText } = $message;
			if (alertType === 'error') {
				toast.error(alertText);
			}
		}
    });

	async function tagEdit(e: MouseEvent & {currentTarget: HTMLAnchorElement}) {
      if (e.metaKey || e.ctrlKey) {
        return
      }
      e.preventDefault()
      const { href } = e.currentTarget
      const result = await preloadData(href)
      if(result.type === 'loaded' && result.status === 200){
        pushState(href, { tagEdit: result.data, profile: undefined })
      } else{
        goto(href);
      }
    }
    let editDialogOpen = false;
	  $: if ($page.state.tagEdit) {
		    editDialogOpen = true;
	  } else {
		    editDialogOpen = false;
	  }
</script>

<Toaster position="top-center" closeButton/>
<form method="POST" use:enhance action="?/createTag" class="grid gap-2 max-w-sm mx-auto">
	<Input 
		id="content"
        type="text"
        placeholder=""
        bind:value={$form.name}
        name="name"
		labelText="Content."
		floatLabel="Type Your Content."
		miniText="Your Content."
    />
	<Button type="submit">
		Edit
	</Button> 
</form>


<Table.Root class="max-w-sm mx-auto">
    <Table.Header>
      <Table.Row>
        <Table.Head>No</Table.Head>
        <Table.Head>Name</Table.Head>
        <Table.Head>Action</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      	{#each data.tags as tag, i (tag.id)}
        	<Table.Row>
        	    <Table.Cell>
        	        {i+1}
        	    </Table.Cell>
        	    <Table.Cell>
        	        {tag.name}
        	    </Table.Cell>
				<Table.Cell>
					<a href={`tags/edit/${tag.id}`} on:click={tagEdit} class="bg-green-200 px-2 py-1 rounded-md">
					  Edit
					</a>
					<AlertDialog.Root>
					  <AlertDialog.Trigger class="bg-red-500 px-2 py-1 rounded-md text-white">
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
							<form method="POST" action='?/deleteTag&id={tag.id}' use:enhance class="">
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

<AlertDialog.Root open={editDialogOpen}
    onOpenChange={(open) => {
      if (!open) {
          history.back();
        }
      }}>
      <AlertDialog.Content class="w-[95%] md:w-[30%]">
      <EditPage data={$page.state.tagEdit}/>
        <AlertDialog.Footer>
          <AlertDialog.Cancel class="w-full">Cancel</AlertDialog.Cancel>
        </AlertDialog.Footer>
      </AlertDialog.Content>
  </AlertDialog.Root>