<script lang="ts">
    import "../app.css";
	export let data;
    import Navbar from "$lib/components/Navbar.svelte";
    import { onNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import navigationState from '$lib/stores/navigationState';
	import PageLoader from '$lib/components/PageLoader.svelte'
	
    onNavigate((navigation) => {
    	if (!document.startViewTransition) return;
    	return new Promise((resolve) => {
			$navigationState = 'loading';
    		document.startViewTransition(async () => {
    			resolve();
    			await navigation.complete;
				$navigationState = 'loaded ';
    		});
    	});
    });;
</script>

{#if $navigationState === 'loading'}
	<PageLoader />
	<div out:fade={{ delay: 500 }}>
		</div>
 {/if}
		
<div class="app max-w-3xl mx-auto font-primary text-primary">
    <Navbar user="{data.user}"/>
    <slot />
</div>