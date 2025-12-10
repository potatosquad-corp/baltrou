import { writable } from 'svelte/store';
import { events } from './event-store';
import type { SseEvent } from '$lib/types/events';

export type TwitchStats = {
	isLive: boolean;
	viewerCount: number;
	followerCount: number;
	subscriberCount: number;
	totalBits: number;
};

const initialState: TwitchStats = {
	isLive: false,
	viewerCount: 0,
	followerCount: 0,
	subscriberCount: 0,
	totalBits: 0
};

const store = writable<TwitchStats>(initialState);

events.subscribe((event: SseEvent | null) => {
	if (event && event.type === 'twitch_stats_update') {
		const newStats = event.data as TwitchStats;

		store.set(newStats);
	}
});

export const stats = {
	subscribe: store.subscribe
};
