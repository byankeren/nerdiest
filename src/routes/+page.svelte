<script lang="ts">
    import Cube from '$lib/components/svg/Cube.svelte'
    import Reading from '$lib/components/svg/Reading.svelte'
    import {Button} from '$lib/components/ui/button'
    import { Box } from 'lucide-svelte';
</script>


<div class="flex flex-col items-center justify-center relative overflow-hidden h-[calc(100dvh-84px)] gap-2 pb-2">
    <Reading/>
    <h1 class="text-pretty md:text-center md:text-balance text-[38px] px-6 font-bold leading-relaxed">The
        <span class="bg-foreground text-background px-2">
            community
        </span>
        of
        <span class="bg-foreground text-background px-2">thinkers</span>
        and the nerds.
    </h1>
    <div class=" animate-floating-1 absolute left-20 top-5 md:left-[120px] w-10">
        <Box class="text-foreground"/>
    </div>
    <div class=" animate-floating-3 absolute right-3 top-[100px] md:right-10">
        <Box class="text-foreground"/>
    </div>
    <div class=" animate-floating-2 absolute left-4 top-[200px] md:left-20">
        <Box class="text-foreground"/>
    </div>    
    <div class="w-full px-6 md:flex gap-2 md:w-[75%]">
        <Button href="/login" class="w-full">Get Started</Button>
    </div>
</div>