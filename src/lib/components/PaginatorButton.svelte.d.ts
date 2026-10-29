import { SvelteComponentTyped } from 'svelte';

export default class PaginatorButton extends SvelteComponentTyped<
	{
		title?: string | number;
		disabled?: boolean;
		page?: string | number;
		active?: boolean;
		onclick?: (event: MouseEvent) => void;
	},
	{ click: MouseEvent },
	{ default: {} }
> {}
