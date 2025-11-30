import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const auth = writable<boolean>(false);
export const appMode = writable<'CONFIG'|'STREAM'>('CONFIG');



const STORAGE_KEY = 'baltrou_timer';

function createTimerStore() {
  const stored = browser ? localStorage.getItem(STORAGE_KEY) : null;
  const initial: Date|null = stored ? new Date(JSON.parse(stored)): null;
  
  const { subscribe,set } = writable<Date|null>(initial);

  return {
    subscribe,
    
    remove: () => {
      set(null);
      if (browser) localStorage.removeItem(STORAGE_KEY);
    },
    set: (date: Date) => {
      set(date)
      if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(date));
      return date;
    }
  };
}

export const timer = createTimerStore();