<script>
	import Paginator from '$lib/components/Paginator.svelte';

	let currentPage = 0;

	function pageChangeHandler(event) {
		currentPage = event.detail.page;
	}

</script>

<div>
	Current Page: {currentPage}
</div>

<Paginator on:change={pageChangeHandler} />

<style>
	div {
		text-align: center;
		font-size: 2.5rem;
		margin: 2rem auto;
	}
</style>
