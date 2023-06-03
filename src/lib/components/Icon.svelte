<script>
    export let name = undefined;
    export let width = 24;
    export let height = 24;
    export let color = undefined;
</script>

{#if name === "first-page" || name === "previous-page" || name === "more-pages" || name === "next-page" || name === "last-page"}
    <span style:color={color}>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
            {#if name === "first-page"}
                <path fill="currentColor" d="M6 18V6h2v12H6Zm11 0l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6L17 18Z"/>
            {:else if name === "previous-page"}
                <path fill="currentColor" d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6L14 18Z"/>
            {:else if name === "more-pages"}
                <path fill="currentColor" d="M6 14q-.825 0-1.413-.588T4 12q0-.825.588-1.413T6 10q.825 0 1.413.588T8 12q0 .825-.588 1.413T6 14Zm6 0q-.825 0-1.413-.588T10 12q0-.825.588-1.413T12 10q.825 0 1.413.588T14 12q0 .825-.588 1.413T12 14Zm6 0q-.825 0-1.413-.588T16 12q0-.825.588-1.413T18 10q.825 0 1.413.588T20 12q0 .825-.588 1.413T18 14Z"/>
            {:else if name === "next-page"}
                <path fill="currentColor" d="M9.4 18L8 16.6l4.6-4.6L8 7.4L9.4 6l6 6l-6 6Z"/>
            {:else if name === "last-page"}
                <path fill="currentColor" d="m7 18l-1.4-1.4l4.6-4.6l-4.6-4.6L7 6l6 6l-6 6Zm9 0V6h2v12h-2Z"/>
            {/if}
        </svg>
    </span>
{/if}

<style>
    span {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>