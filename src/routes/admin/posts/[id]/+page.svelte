<script lang="ts">
    export let data;
    const post = data.post[0]
</script>

<p>ID: {post.id}</p>
<p>Content: {post.content}</p>
<p>Created At: {post.creaetedAt}</p>