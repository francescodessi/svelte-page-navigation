import { SvelteComponentTyped } from 'svelte';

export default class Icon extends SvelteComponentTyped<{
	name?: string;
	width?: number;
	height?: number;
	color?: string;
}> {}
