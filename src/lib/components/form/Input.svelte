<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export let type: HTMLInputAttributes['type'];
	export let value: string = '';
	export let label: string = '';
	export let className: string = '';
	export let placeholder: string = '';
	export let errorMessage: object | undefined = undefined;
</script>

<label class="grid">
	<span class="font-semibold">{label}</span>
		
	<div class="flex items-center justify-start border-primary border-y-2 border-x-2 rounded-sm ">
		<div class="px-2 justify-center border-primary border-r-2 py-2">
			<slot/>
		</div>
		<input
		{...{ type }}
		bind:value
		{placeholder}
		class={`focus:outline-none h-full bg-transparent w-full px-3 ${className}`}
		{...$$restProps}
		/>
	</div>

	<div>
		{#if errorMessage}
			<p class="text-red-500">{errorMessage}</p>
		{/if}
	</div>
	
</label>