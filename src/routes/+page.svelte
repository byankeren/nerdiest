<script lang="ts">
    import Typewriter from 'svelte-typewriter'

    import Cube from '$lib/components/svg/Cube.svelte'
    import Peep from '$lib/components/svg/Peep.svelte'
    import Reading from '$lib/components/svg/Reading.svelte'
    import {Button} from '$lib/components/ui/button'
</script>


<div class="flex flex-col items-center justify-center relative overflow-hidden h-[calc(100dvh-60px)] gap-2 pb-2">
        <Reading/>
        <h1 class="text-pretty md:text-center md:text-balance text-[38px] px-6 font-bold leading-relaxed">The
            <span class="bg-primary text-white px-2">
                community
            </span>
            of
            <span class="bg-primary text-white px-2">thinkers</span>
            and the nerds.
        </h1>
        <!-- <div>
            <Typewriter mode="loopRandom" interval=70>
                <h1 class="">Hello</h1>
                <h1 class="">Bonjour</h1>
                <h1 class="">Ciao</h1>
                <h1 class="">Hola</h1>
                <h1 class="">Olá</h1>
                <h1 class="">안녕하세요</h1>
                <h1 class="">こんにちは</h1>
            </Typewriter>
        </div> -->


    <div class="animate-floating-1 absolute left-20 top-5 md:left-[120px] w-10">
        <Cube />
    </div>
    <div class="animate-floating-3 absolute right-3 top-[100px] md:right-10">
        <Cube/>
    </div>
    <div class="animate-floating-2 absolute left-4 top-[200px] md:left-20">
        <Cube/>
    </div>
    
    <div class="w-full px-6 md:flex gap-2 md:w-[75%]">
        <Button href="/login" class="w-full">Get Started</Button>
    </div>
</div>