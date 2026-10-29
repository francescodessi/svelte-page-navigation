<script>
	import { Paginator } from '@dflare/svelte-page-navigation';
	import { writable } from 'svelte/store';
	import CustomButton from './LegacyButton.svelte';
	const page = writable(0);
	let pages = 20;
	let events = 0;
	let callbacks = 0;
	let custom = false;
	let visible = true;
</script>

<button on:click={() => (pages = 0)}>Empty</button>
<button on:click={() => (pages = 20)}>Restore</button>
<button on:click={() => (pages = 3)}>Shrink</button>
<button on:click={() => ($page = 19)}>Jump</button>
<button on:click={() => (pages = 1000000000)}>Huge</button>
<button on:click={() => (custom = !custom)}>Custom</button>
<button on:click={() => (visible = !visible)}>Toggle</button>
<output data-testid="page">{$page}</output>
<output data-testid="events">{events}</output>
<output data-testid="callbacks">{callbacks}</output>
{#if visible}
	<Paginator
		{pages}
		bind:currentPage={$page}
		initChunkSize={10}
		showCurrentPageLabel={true}
		customPaginatorButton={custom ? CustomButton : undefined}
		on:change={() => events++}
		onchange={() => callbacks++}
	/>
{/if}
