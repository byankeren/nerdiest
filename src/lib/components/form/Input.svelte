<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export let type: HTMLInputAttributes['type'];
	export let value: string = '';
	export let label: string = '';
	export let placeholder: string = '';
	export let errorMessage: object | undefined = undefined;
</script>

<label class="grid text-sm">
	<span>{label}</span>

	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{/if}

	<input
		{...{ type }}
		bind:value
		{placeholder}
		class='rounded border bg-transparent px-3 py-2'
		{...$$restProps}
	/>
</label>