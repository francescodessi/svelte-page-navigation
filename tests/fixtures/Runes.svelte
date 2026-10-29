<script>
	import { Paginator } from '@dflare/svelte-page-navigation';
	import CustomButton from './RunesButton.svelte';
	let page = $state(0);
	let pages = $state(20);
	let callbacks = $state(0);
	let custom = $state(false);
	let visible = $state(true);
</script>

<button onclick={() => (pages = 0)}>Empty</button>
<button onclick={() => (pages = 20)}>Restore</button>
<button onclick={() => (pages = 3)}>Shrink</button>
<button onclick={() => (page = 19)}>Jump</button>
<button onclick={() => (pages = 1000000000)}>Huge</button>
<button onclick={() => (custom = !custom)}>Custom</button>
<button onclick={() => (visible = !visible)}>Toggle</button>
<output data-testid="page">{page}</output>
<output data-testid="callbacks">{callbacks}</output>
{#if visible}
	<Paginator
		{pages}
		bind:currentPage={page}
		initChunkSize={10}
		showCurrentPageLabel={true}
		customPaginatorButton={custom ? CustomButton : undefined}
		onchange={() => callbacks++}
	/>
{/if}
