<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputEvents } from './index.js';
	import { Label } from '../label/index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLInputAttributes;
	type $$Events = InputEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export let id: $$Props['id'] = undefined;
	export let labelText: string = '';
	export let floatLabel: string = '';
	export let miniText: string = '';
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props['readonly'] = undefined;
</script>
<div class="">
<Label for={id}>
	{labelText}
</Label>
<div class="relative">		
	<input
		class={cn(
			'border peer h-full w-full rounded-[8px] border-t-0 px-3 py-2 text-sm font-normal text-blue-gray-700 transition-all placeholder-shown:border placeholder-shown:border-input placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-input focus:border-t-transparent focus:outline-0 disabled:border-0 placeholder:opacity-0 focus:placeholder:opacity-100',
			className
		)}
		id={id} 
		bind:value
		{readonly}
		on:blur
		on:change
		on:click
		on:focus
		on:focusin
		on:focusout
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:paste
		on:input
		on:wheel
		autocomplete="off"
		{...$$restProps}
	/>
    <label for={id}
	 	class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 
	  	flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all 
	  	before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 
	  	before:rounded-tl-2xl before:border-t-2 before:border-l before:border-input before:transition-all after:pointer-events-none 
	  	after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-2xl after:border-t 
	  	after:border-r after:border-input after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] 
	  	peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent 
	  	peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-forebackground peer-focus:before:border-t-2 peer-focus:before:border-l-2 
	  	peer-focus:before:!border-input peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-input 
	  	peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent 
	  	peer-disabled:peer-placeholder-shown:text-blue-gray-500">
      {floatLabel}
    </label>
	<p class="text-sm flex gap-1 items-center text-muted-foreground">
		<!-- <CircleAlert size={16}/> -->
		{miniText}
	</p>
</div>
</div>