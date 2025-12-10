import type { Writable } from 'svelte/store';

/**
 * @param {import('svelte/store').Writable} store - Le store Svelte
 * @param {string|number} uuid - L'ID à chercher
 * @param {function} callback - La modification à apporter
 */
export const updateStoreItem = <T extends { uuid: string }>(
	store: Writable<T[]>,
	uuid: string,
	callback: (item: T) => T
) => {
	store.update((items) => items.map((item) => (item.uuid === uuid ? callback(item) : item)));
};

/**
 * Une fonction 'replacer' pour JSON.stringify
 * pour gérer les types de données complexes (ex: Map, Set)
 * et éviter les références circulaires.
 */
export function jsonReplacer(key: string, value: any) {
	if (value instanceof Map) {
		return { _type: 'Map', data: Array.from(value.entries()) };
	}
	if (value instanceof Set) {
		return { _type: 'Set', data: Array.from(value.values()) };
	}
	return value;
}
 
/** Function that does nothing at all */
export const noop = () => {};