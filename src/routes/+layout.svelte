<script>
    import "../app.css";
	import Navbar from "$lib/components/Navbar.svelte"
</script>
<div class="app max-w-3xl mx-auto font-primary">
	<Navbar/>
	<main class="h-dvh text-primary">
		<slot />
	</main>
</div>