<script>
	import { onDestroy, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import navigationState from '../stores/navigationState';

	const progress = tweened(0, {
		easing: cubicOut
	});
	const unsubscribe = navigationState.subscribe((state) => {
		if (state === 'loaded') {
			progress.set(1);
		}
	});
	onMount(() => {
		progress.set(1);
	});
	onDestroy(() => {
		unsubscribe();
	});
</script>


<div class="progress-bar">
	<div class="progress-sliver bg-black" style={`--width: ${$progress * 100}%`}></div>
</div>

<style>
	.progress-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 0.5rem;
	}
	.progress-sliver {
		width: var(--width);
		height: 100%;
	}
</style>