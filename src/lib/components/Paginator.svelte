<script>
    import Icon from "./Icon.svelte";
    import PaginatorButton from "./PaginatorButton.svelte";
    import {getArrayOfNumbers, arrayChunks} from "../utilities.js"
    import { onMount, createEventDispatcher } from 'svelte';
    import { tick } from 'svelte';

    const dispatch = createEventDispatcher();

    export let pages = 10;
    export let currentPage = 0;
    export let initChunkSize = pages;
    export let initShowFirstButton = true;
    export let initShowLastButton = true;
    export let showCurrentPageLabel = false;
    export let customPaginatorButton = undefined;

    let nav;
    let chunkSize = 0;
    let chunks = [];
    let currentChunk = 0;
    let showFirstButton = true;
    let showLastButton = true;

    $: showFirstButton = initShowFirstButton;
    $: showLastButton = initShowLastButton;
    $: chunkSize = initChunkSize;
    $: chunks = arrayChunks(getArrayOfNumbers(pages), chunkSize);
    $: currentChunk = chunks.findIndex(chunk => chunk.includes(currentPage));
    $: dispatch('change', {page: currentPage});

    onMount(() => {
        const resizeObserver = new ResizeObserver(async () => {
            chunkSize = initChunkSize;
            showFirstButton = initShowFirstButton;
            showLastButton = initShowLastButton;
            await tick();
            adjustChunks();
        });

        resizeObserver.observe(nav);
        return () => resizeObserver.unobserve(nav);
    });

    async function adjustChunks() {
        const buttonWrapped = [...nav.children].findIndex(button => button.previousElementSibling && button.offsetTop > button.previousElementSibling.offsetTop);
        if(buttonWrapped > 0) {
            if(chunkSize > 0) {
                chunkSize--;
                await tick();
                adjustChunks();
            }
            else if(showFirstButton || showLastButton) {
                showFirstButton = false;
                showLastButton = false;
                await tick();
            }
        }
    }

    function jumpToPage(event) {
        currentPage = Number(event.currentTarget.dataset.page);
    }
</script>

{#if pages > 0}
    <nav bind:this={nav}>
        {#if showFirstButton}
            <div>
                <svelte:component this={customPaginatorButton ?? PaginatorButton} disabled={currentPage <= 0} page="0" on:click={jumpToPage} title="First">
                    <Icon name="first-page"/>
                </svelte:component>
            </div>
        {/if}

        <div>
            <svelte:component this={customPaginatorButton ?? PaginatorButton} disabled={currentPage <= 0} page={currentPage - 1} on:click={jumpToPage} title="Previous">
                <Icon name="previous-page"/>
            </svelte:component>
        </div>
        
        {#if chunks.length > 1 && currentChunk > 0 && chunkSize > 1}
            <div>
                <svelte:component this={customPaginatorButton ?? PaginatorButton} page={chunks[currentChunk - 1][0]} on:click={jumpToPage} title="More">
                    <Icon name="more-pages"/>
                </svelte:component>
            </div>
        {/if}
        
        {#if chunks.length > 0}
            {#each chunks[currentChunk] as page (page)}
                <div>
                    <svelte:component this={customPaginatorButton ?? PaginatorButton} active={page === currentPage} page={page} on:click={jumpToPage} title={page + 1}>
                        {page + 1}
                    </svelte:component>
                </div>
            {/each}
        {/if}
        
        {#if chunks.length > 1 && currentChunk < chunks.length - 1 && chunkSize > 1}
            <div>
                <svelte:component this={customPaginatorButton ?? PaginatorButton} page={chunks[currentChunk + 1][0]} on:click={jumpToPage} title="More">
                    <Icon name="more-pages"/>
                </svelte:component>
            </div>
        {/if}
        
        <div>
            <svelte:component this={customPaginatorButton ?? PaginatorButton} disabled={currentPage >= pages - 1} page={currentPage + 1} on:click={jumpToPage} title="Next">
                <Icon name="next-page"/>
            </svelte:component>
        </div>
        
        {#if showLastButton}
            <div>
                <svelte:component this={customPaginatorButton ?? PaginatorButton} disabled={currentPage >= pages - 1} page={pages - 1} on:click={jumpToPage} title="Last">
                    <Icon name="last-page"/>
                </svelte:component>
            </div>
        {/if}
    </nav>
    {#if showCurrentPageLabel}
        <div align="center">
            {currentPage + 1} of {pages}
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
</style>