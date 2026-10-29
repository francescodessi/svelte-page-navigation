<script>
	export let title = undefined;
	export let disabled = false;
	export let page = undefined;
	export let active = false;
	/** @type {((event: MouseEvent) => void) | undefined} */
	export let onclick = undefined;
</script>

<button
	type="button"
	{disabled}
	data-page={page}
	class:active
	{title}
	aria-label={title}
	aria-current={active ? 'page' : undefined}
	on:click={onclick}
	on:click
>
	<slot></slot>
</button>

<style>
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: auto;
		height: 100%;
		padding: 0.75rem 1rem;
		border: 0;
		margin: 0;
		border-radius: 0;
		text-align: center;
		cursor: pointer;
		background-color: #1095c1;
		color: #f0f0f0;
		word-break: break-all;
		overflow: hidden;
		transition:
			background-color,
			opacity 0.15s ease;
	}

	button:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: -3px;
	}

	button:hover {
		background-color: #07aee5;
	}

	button:active {
		transform: scale(0.95);
	}

	button[disabled] {
		opacity: 0.5;
		pointer-events: none;
	}

	button.active {
		background-color: #4caf50;
		font-weight: bold;
	}
</style>
