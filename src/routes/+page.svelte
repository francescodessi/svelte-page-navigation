<script>
	import { onMount } from 'svelte';
	import Paginator from '$lib/components/Paginator.svelte';

    let theme;

	$: icon = theme === "light" ? "material-symbols:dark-mode-outline" : theme === "dark" ? "material-symbols:light-mode-outline" : undefined;
    $: label = `Activate ${theme === "light" ? "dark" : "light"} mode`;

    onMount(() => {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    function themSwitch() {
        theme = document.querySelector("html").getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.querySelector("html").setAttribute("data-theme", theme); 
    }  

	let pages = 10;
	let inputPagesError;
	
	let currentPage = 0;
	let currentPageError;

	let initChunkSize = pages;
	let initChunkSizeError;

	let initShowFirstButton = true;
    let initShowLastButton = true;
    let showCurrentPageLabel = true;

	function pageChangeHandler(event) {
		currentPage = event.detail.page;
	}

	function pagesInputHandler(event) {
		if(Number(event.currentTarget.value) > 0) {
			pages = Number(event.currentTarget.value);
			currentPage = currentPage >= 0 && currentPage < pages ? currentPage : 0;
			initChunkSize = initChunkSize >= 0 && initChunkSize <= pages ? initChunkSize : pages;
			inputPagesError = undefined;
		}
		else {
			inputPagesError = "It must be an integer greater than 0.";
		}
	}

	function currentPageInputHandler(event) {
		if(Number(event.currentTarget.value) >= 0 && Number(event.currentTarget.value) < pages) {
			currentPage = Number(event.currentTarget.value);
			currentPageError = undefined;
		}
		else {
			currentPageError = `It must be an integer greater than or equal to 0 and less than ${pages}.`;
		}
	}
	
	function initChunkSizeInputHandler(event) {
		if(Number(event.currentTarget.value) >= 0 && Number(event.currentTarget.value) <= pages) {
			initChunkSize = Number(event.currentTarget.value);	
			initChunkSizeError = undefined;
		}
		else {
			initChunkSizeError = `It must be an integer greater than or equal to 0 and less than or equal to ${pages}.`;
		}
	}
</script>

<div class="container">
    <article>
        <header>
            <strong>Svelte Page Navigation</strong>
            <a href="https://github.com/francescodessi/svelte-page-navigation" target="_blank" title="GitHub" role="button" class="secondary outline github-link"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg></a>
            {#if icon}
            <button type="button" on:click={themSwitch} class="secondary outline theme-switch-button" title={label}>
                {#if theme === "light"}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21Zm0-2q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5 12q0 2.9 2.05 4.95T12 19Zm-.25-6.75Z"/></svg>
                {:else if theme === "dark"}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15q1.25 0 2.125-.875T15 12q0-1.25-.875-2.125T12 9q-1.25 0-2.125.875T9 12q0 1.25.875 2.125T12 15Zm0 2q-2.075 0-3.538-1.463T7 12q0-2.075 1.463-3.538T12 7q2.075 0 3.538 1.463T17 12q0 2.075-1.463 3.538T12 17ZM2 13q-.425 0-.713-.288T1 12q0-.425.288-.713T2 11h2q.425 0 .713.288T5 12q0 .425-.288.713T4 13H2Zm18 0q-.425 0-.713-.288T19 12q0-.425.288-.713T20 11h2q.425 0 .713.288T23 12q0 .425-.288.713T22 13h-2Zm-8-8q-.425 0-.713-.288T11 4V2q0-.425.288-.713T12 1q.425 0 .713.288T13 2v2q0 .425-.288.713T12 5Zm0 18q-.425 0-.713-.288T11 22v-2q0-.425.288-.713T12 19q.425 0 .713.288T13 20v2q0 .425-.288.713T12 23ZM5.65 7.05L4.575 6q-.3-.275-.288-.7t.288-.725q.3-.3.725-.3t.7.3L7.05 5.65q.275.3.275.7t-.275.7q-.275.3-.687.288T5.65 7.05ZM18 19.425l-1.05-1.075q-.275-.3-.275-.713t.275-.687q.275-.3.688-.287t.712.287L19.425 18q.3.275.288.7t-.288.725q-.3.3-.725.3t-.7-.3ZM16.95 7.05q-.3-.275-.288-.687t.288-.713L18 4.575q.275-.3.7-.288t.725.288q.3.3.3.725t-.3.7L18.35 7.05q-.3.275-.7.275t-.7-.275ZM4.575 19.425q-.3-.3-.3-.725t.3-.7l1.075-1.05q.3-.275.712-.275t.688.275q.3.275.288.688t-.288.712L6 19.425q-.275.3-.7.288t-.725-.288ZM12 12Z"/></svg>
                {/if}
            </button>
            {/if}            
        </header>

		<div class="paginator-container">
			<h4>Current Page: {currentPage + 1}</h4>
			<Paginator 
				pages={pages} 
				currentPage={currentPage} 
				initChunkSize={initChunkSize} 
				initShowFirstButton={initShowFirstButton}
				initShowLastButton={initShowLastButton}
				showCurrentPageLabel={showCurrentPageLabel}
				on:change={pageChangeHandler} />
			<div style="margin: 24px 10px 0 0; text-align: right;"><small>Try resizing the width</small></div>
		</div>		

        <div class="grid">
            <label for="pages">
                Pages
                <input type="number" id="pages" name="pages" required min="1" aria-invalid={inputPagesError != null} value={pages} on:change={pagesInputHandler}/>
				{#if inputPagesError}
					<small class="error">{inputPagesError}</small>
				{/if}
            </label>
            <label for="currentPage">
                Current Page (zero-based)
                <input type="number" id="currentPage" name="currentPage" required min="0" max={pages - 1} aria-invalid={currentPageError != null} value={currentPage} on:change={currentPageInputHandler}/>
				{#if currentPageError}
					<small class="error">{currentPageError}</small>
				{/if}
            </label>
			<label for="initChunkSize">
                Initial Chunk Size
                <input type="number" id="initChunkSize" name="initChunkSize" required min="0" max={pages} aria-invalid={initChunkSizeError != null} value={initChunkSize} on:change={initChunkSizeInputHandler}/>
				{#if initChunkSizeError}
					<small class="error">{initChunkSizeError}</small>
				{/if}
            </label>
        </div>

		<div class="grid">
            <label for="initShowFirstButton">
				<input type="checkbox" id="initShowFirstButton" name="initShowFirstButton" role="switch" bind:checked={initShowFirstButton}/>
				Show First Page Button
            </label>
			<label for="initShowLastButton">
				<input type="checkbox" id="initShowLastButton" name="initShowLastButton" role="switch" bind:checked={initShowLastButton}/>
				Show Last Page Button
            </label>
			<label for="showCurrentPageLabel">
				<input type="checkbox" id="showCurrentPageLabel" name="showCurrentPageLabel" role="switch" bind:checked={showCurrentPageLabel}/>
				Show Current Page Label
            </label>
		</div>
    </article>
</div>

<style>
    @import "https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css";

    header {
        display: flex;
        flex-wrap: wrap;
    }

    header > :nth-child(2) {
        margin: 0 0 0 auto;
    }

    .theme-switch-button, .github-link {
        width: fit-content;        
        padding: 0;
        border: 0;
        box-shadow: none;
    }

	.paginator-container {
		text-align: center;
		margin: 2rem auto;
		min-width: 230px;
		max-width: 100%;
		border: 1px solid;
		resize: horizontal;
  		overflow: auto;
	}

	.error {
		color: red;
	}
</style>
