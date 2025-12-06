import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const auth = writable<boolean>(false);

function createAppModeStore() {
	const STORAGE_KEY = 'baltrou_mode';
	const stored = browser ? localStorage.getItem(STORAGE_KEY) : null;
	const initial: 'CONFIG' | 'STREAM' = stored ? JSON.parse(stored) : 'CONFIG';

	const { subscribe, set } = writable<'CONFIG' | 'STREAM'>(initial);
	return {
		subscribe,
		set: (mode: 'CONFIG' | 'STREAM') => {
			set(mode);
			if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(mode));
			return mode;
		}
	};
}

function createTimerStore() {
	const STORAGE_KEY = 'baltrou_timer';
	const stored = browser ? localStorage.getItem(STORAGE_KEY) : null;
	const initial: Date | null = stored ? new Date(JSON.parse(stored)) : null;

	const { subscribe, set } = writable<Date | null>(initial);

	return {
		subscribe,

		remove: () => {
			set(null);
			if (browser) localStorage.removeItem(STORAGE_KEY);
		},
		set: (date: Date) => {
			set(date);
			if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(date));
			return date;
		}
	};
}

export const timer = createTimerStore();
export const appMode = createAppModeStore();
