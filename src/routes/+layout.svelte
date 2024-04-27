<script lang="ts">
    import "../app.css";
	export let data;
    import Navbar from "$lib/components/Navbar.svelte";
    import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';

    onNavigate((navigation) => {
    	if (!document.startViewTransition) return;
    
    	return new Promise((resolve) => {
    		document.startViewTransition(async () => {
    			resolve();
    			await navigation.complete;
    		});
    	});
    });
</script>

<div class="app max-w-3xl mx-auto font-primary text-primary">
    <Navbar user="{data.user}"/>
	<!-- {$page.url.pathname} -->
    <slot />
</div>