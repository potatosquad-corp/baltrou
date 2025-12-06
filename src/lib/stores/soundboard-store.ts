import { writable } from 'svelte/store';

export interface Sound {
	id: string;
	name: string;
}

export const soundboardStore = writable<Sound[]>([]);
