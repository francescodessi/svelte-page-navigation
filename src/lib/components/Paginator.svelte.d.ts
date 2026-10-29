import { SvelteComponentTyped } from 'svelte';

/** Supports both legacy component constructors and Svelte 5 function components. */
export type PaginatorButtonComponent =
	(new (...args: any[]) => SvelteComponentTyped<any, any, any>) | ((...args: any[]) => any);

export interface PaginatorProps {
	pages?: number;
	currentPage?: number;
	initChunkSize?: number;
	initShowFirstButton?: boolean;
	initShowLastButton?: boolean;
	showCurrentPageLabel?: boolean;
	customPaginatorButton?: PaginatorButtonComponent;
	/** Called on mount and whenever the zero-based current page changes. */
	onchange?: (detail: { page: number }) => void;
}

/** Legacy events and bind:currentPage remain available in Svelte 3, 4 and 5. */
export default class Paginator extends SvelteComponentTyped<
	PaginatorProps,
	{ change: CustomEvent<{ page: number }> },
	{}
> {}
