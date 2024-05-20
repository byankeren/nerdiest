<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { Editor } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'

    import { Pilcrow } from 'lucide-svelte';
    import { Bold } from 'lucide-svelte';
    import { Italic } from 'lucide-svelte';
    import { Quote } from 'lucide-svelte';
    import { Code } from 'lucide-svelte';
    import { Undo } from 'lucide-svelte';
    import { Redo } from 'lucide-svelte';
  
    let element: HTMLDivElement
    let editor: Editor

    export let content = '';
  
    onMount(() => {
      editor = new Editor({
        element: element,
        extensions: [
          StarterKit,
        ],
        editorProps: {
			  attributes: {
			    class: 'prose dark:prose-invert focus:outline-none px-2 indent-0 margin-0'
			  }
		},
        content: '<p>Hello World!</p>',
		onTransaction: () => {
			editor = editor;
			content = editor.getHTML();
		}
      })
    })
  
    onDestroy(() => {
      if (editor) {
        editor.destroy()
      }
    })
  </script>
  
    <div 
        bind:this={element} 
        class="block px-1 border-0 py-2 text-gray-900 border-b-[3px] border-input ring-inset ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 indent-0 max-h-[200px] overflow-y-auto"
    >
    </div>
    {#if editor}
  <div class="flex gap-2 p-2 flex-wrap">
    <button type="button" on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>
      <Pilcrow size={20}/>
    </button>
    <button type="button" on:click={() => editor.chain().focus().toggleBold().run()} class:active="{editor.isActive('bold')}">
        <Bold size={20}/>
    </button>
    <button type="button" on:click={editor.chain().focus().toggleItalic().run()} class:active="{ editor.isActive('italic') }">
        <Italic size={20}/>
    </button>
    <button
      type="button" on:click={editor.chain().focus().undo().run()}>
      <Undo size={20}/>
    </button>
    <button
      type="button" on:click={editor.chain().focus().redo().run()}>
      <Redo size={20}/>
    </button>
  </div>
  {/if}
  <style>
    button.active {
      background: black;
      color: white;
      border-radius: 99px;
      padding: 4px;
    }
  </style>