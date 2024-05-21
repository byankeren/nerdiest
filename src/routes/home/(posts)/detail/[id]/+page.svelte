<script lang="ts">
    import Comment from '$lib/components/Comment.svelte'
	import { superForm } from 'sveltekit-superforms';	
	import { Input } from '$lib/components/ui/input/index.js';
    import { Button } from "$lib/components/ui/button/index.js";
	import { Toaster, toast } from 'svelte-sonner'	
    export let data;

    const { form, errors, enhance, delayed, message} = superForm(data.form, {		
		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;

			if (alertType === 'error') {
				toast.error(alertText);
			}
			if (alertType === 'emailAndPass') {
				toast.error(alertText);
			}
		}
	});

    const { 
        form: replyForm,
        errors: replyErrors,
        enhance: replyEnhance,
        delayed: replyDelayed,
        message: replyMessage
        } = superForm(data.replyForm);
</script>

<Toaster position="top-center" closeButton/>

<div class="px-4 w-full md:w-[65%] grid gap-4 mx-auto mb-20">
    {data.displayPost.content}
    <form method="POST" use:enhance action="?/postComments&post_id={data.displayPost.id}" class="grid gap-2 mb-2">
        <Input
            id="content"
            type="text"
            placeholder=""
            name="content"
            bind:value={$form.content}
            labelText="content."
            floatLabel="Type Your content."
            miniText="Your content."
        />
        <Button disabled={$replyDelayed} size="sm">Submit</Button>
    </form>
    <Comment comments={data.displayPost.comments} bind:formBind={$replyForm.content}>
    </Comment>
</div>