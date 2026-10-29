<script>
	let { title, disabled = false, page, active = false, onclick, children } = $props();
</script>

<button type="button" {disabled} data-page={page} {title} class:active {onclick}>
	{@render children?.()}
</button>

<style>
	button {
		min-width: 44px;
		min-height: 44px;
	}
</style>
