<script>
    export let title = undefined;
    export let disabled = false;
    export let page = undefined;
    export let active = false;
</script>

<button type="button" disabled={disabled} data-page={page} class:active={active} title={title} on:click>
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
        transition: background-color, opacity 0.15s ease;
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
        background-color: #4CAF50;
        font-weight: bold;
    }
</style>