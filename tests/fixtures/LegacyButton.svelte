<script>
	export let title = undefined;
	export let disabled = false;
	export let page = undefined;
	export let active = false;
</script>

<button type="button" {disabled} data-page={page} {title} class:active on:click>
	<slot />
</button>

<style>
	button {
		min-width: 44px;
		min-height: 44px;
	}
</style>
