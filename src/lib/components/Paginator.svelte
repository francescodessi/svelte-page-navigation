<script>
	import Icon from './Icon.svelte';
	import PaginatorButton from './PaginatorButton.svelte';
	import { pageCount, clampPage, pageWindow } from '../utilities.js';
	import { onMount, createEventDispatcher, tick } from 'svelte';

	const dispatch = createEventDispatcher();
	export let pages = 10;
	export let currentPage = 0;
	export let initChunkSize = pages;
	export let initShowFirstButton = true;
	export let initShowLastButton = true;
	export let showCurrentPageLabel = false;
	/** @type {import('./Paginator.svelte').PaginatorButtonComponent | undefined} */
	export let customPaginatorButton = undefined;
	/** @type {((detail: {page: number}) => void) | undefined} */
	export let onchange = undefined;

	/** @type {HTMLElement | undefined} */
	let nav;
	let chunkSize = 0;
	let showFirstButton = initShowFirstButton;
	let showLastButton = initShowLastButton;
	let mounted = false;
	/** @type {number | undefined} */
	let lastNotified;
	let frame = 0;
	let generation = 0;
	const handledClicks = new WeakSet();
	/** @type {unknown[]} */
	let layoutInputs = [];

	$: total = pageCount(pages);
	$: currentPage = clampPage(currentPage, total);
	$: group = pageWindow(total, currentPage, chunkSize);
	$: if (mounted) notify(currentPage);
	$: if (nav)
		scheduleLayout(
			pages,
			currentPage,
			initChunkSize,
			initShowFirstButton,
			initShowLastButton,
			customPaginatorButton
		);

	onMount(() => {
		mounted = true;
	});

	/** @param {number} page */
	function notify(page) {
		if (lastNotified === page) return;
		lastNotified = page;
		dispatch('change', { page });
		onchange?.({ page });
	}

	// An action follows the conditional nav through pages=0 and back.
	/** @param {HTMLElement} node */
	function observe(node) {
		let width = -1;
		const resize = () => {
			const next = node.clientWidth;
			if (next !== width) {
				width = next;
				scheduleLayout();
			}
		};
		const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
		observer?.observe(node);
		window.addEventListener('resize', resize);
		resize();
		return {
			destroy() {
				generation++;
				cancelAnimationFrame(frame);
				observer?.disconnect();
				window.removeEventListener('resize', resize);
			}
		};
	}

	// Coalesce resize/prop changes and cancel stale work after every await.
	/** @param {...unknown} _dependencies */
	function scheduleLayout(..._dependencies) {
		const id = ++generation;
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			adjustChunks(id);
		});
	}

	/** @param {number} id */
	async function adjustChunks(id) {
		const node = nav;
		if (!node || id !== generation) return;
		const inputs = [
			node,
			node.clientWidth,
			total,
			initChunkSize,
			initShowFirstButton,
			initShowLastButton,
			customPaginatorButton
		];
		const reset = inputs.some((value, index) => value !== layoutInputs[index]);
		// Keep the fitted group on page changes. Probing recreates keyed buttons,
		// which restarts hover/focus styles even if every tick precedes a paint.
		if (!reset && !wrapped(node)) return;
		layoutInputs = [];
		if (reset) {
			showFirstButton = initShowFirstButton;
			showLastButton = initShowLastButton;
		}
		// Each wrapper occupies at least one CSS pixel; bound temporary allocations.
		let low = 0;
		let high = reset
			? Math.min(pageCount(initChunkSize), total, Math.ceil(node.clientWidth))
			: chunkSize;
		while (low < high) {
			chunkSize = Math.ceil((low + high) / 2);
			await tick();
			if (id !== generation || !node.isConnected) return;
			if (wrapped(node)) high = chunkSize - 1;
			else low = chunkSize;
		}
		chunkSize = low;
		await tick();
		if (id !== generation || !node.isConnected) return;
		if (wrapped(node)) {
			showFirstButton = false;
			showLastButton = false;
		}
		layoutInputs = inputs;
	}

	/** @param {HTMLElement} node */
	function wrapped(node) {
		return [...node.children]
			.filter((button) => button instanceof HTMLElement)
			.some(
				(button) =>
					button.previousElementSibling instanceof HTMLElement &&
					button.offsetTop > button.previousElementSibling.offsetTop
			);
	}

	/** @param {MouseEvent} event */
	function jumpToPage(event) {
		// A custom button may forward both the legacy event and the callback.
		if (handledClicks.has(event)) return;
		handledClicks.add(event);
		const value = /** @type {HTMLElement | null} */ (event.currentTarget)?.dataset.page;
		if (value !== undefined) currentPage = clampPage(value, total);
	}
</script>

{#if total > 0}
	<nav bind:this={nav} use:observe aria-label="Pagination">
		{#if showFirstButton}
			<div>
				<svelte:component
					this={customPaginatorButton ?? PaginatorButton}
					disabled={currentPage <= 0}
					page="0"
					on:click={jumpToPage}
					onclick={jumpToPage}
					title="First"
				>
					<Icon name="first-page" />
				</svelte:component>
			</div>
		{/if}

		<div>
			<svelte:component
				this={customPaginatorButton ?? PaginatorButton}
				disabled={currentPage <= 0}
				page={currentPage - 1}
				on:click={jumpToPage}
				onclick={jumpToPage}
				title="Previous"
			>
				<Icon name="previous-page" />
			</svelte:component>
		</div>

		{#if group.previous !== null && chunkSize > 1}
			<div>
				<svelte:component
					this={customPaginatorButton ?? PaginatorButton}
					page={group.previous}
					on:click={jumpToPage}
					onclick={jumpToPage}
					title="More"
				>
					<Icon name="more-pages" />
				</svelte:component>
			</div>
		{/if}

		{#if group.pages.length > 0}
			{#each group.pages as page (page)}
				<div>
					<svelte:component
						this={customPaginatorButton ?? PaginatorButton}
						active={page === currentPage}
						{page}
						on:click={jumpToPage}
						onclick={jumpToPage}
						title={page + 1}
					>
						{page + 1}
					</svelte:component>
				</div>
			{/each}
		{/if}

		{#if group.next !== null && chunkSize > 1}
			<div>
				<svelte:component
					this={customPaginatorButton ?? PaginatorButton}
					page={group.next}
					on:click={jumpToPage}
					onclick={jumpToPage}
					title="More"
				>
					<Icon name="more-pages" />
				</svelte:component>
			</div>
		{/if}

		<div>
			<svelte:component
				this={customPaginatorButton ?? PaginatorButton}
				disabled={currentPage >= total - 1}
				page={currentPage + 1}
				on:click={jumpToPage}
				onclick={jumpToPage}
				title="Next"
			>
				<Icon name="next-page" />
			</svelte:component>
		</div>

		{#if showLastButton}
			<div>
				<svelte:component
					this={customPaginatorButton ?? PaginatorButton}
					disabled={currentPage >= total - 1}
					page={total - 1}
					on:click={jumpToPage}
					onclick={jumpToPage}
					title="Last"
				>
					<Icon name="last-page" />
				</svelte:component>
			</div>
		{/if}
	</nav>
	{#if showCurrentPageLabel}
		<div class="page-label" aria-live="polite" aria-atomic="true">
			{currentPage + 1} of {total}
		</div>
	{/if}
{/if}

<style>
	nav {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		align-items: stretch;
		gap: 2px;
		margin-bottom: 1rem;
	}

	nav div {
		min-width: 1px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	nav div:first-child {
		margin-left: auto;
	}

	nav div:last-child {
		margin-right: auto;
	}
	.page-label {
		text-align: center;
	}
</style>
