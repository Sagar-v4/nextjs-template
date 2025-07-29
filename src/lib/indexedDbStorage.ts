'use client';

import { del, get, set } from 'idb-keyval';
import { toast } from 'sonner';
import { StateStorage } from 'zustand/middleware';

export const indexedDBStorage: StateStorage = {
	getItem: async (name) => {
		if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
			return null;
		}

		try {
			const value = await get(name);
			if (!value) return null;

			// Restore dates
			const parsed = JSON.parse(value);
			if (parsed?.state?.data?.display_date) {
				parsed.state.data.display_date = new Date(
					parsed.state.data.display_date,
				);
			}

			return JSON.stringify(parsed);
		} catch (err) {
			toast.error('Failed to get from IndexedDB:', {
				description: String(err),
			});
			return null;
		}
	},
	setItem: async (name, value) => {
		if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
			return;
		}

		try {
			await set(name, value);
		} catch (err) {
			toast.error('Failed to set from IndexedDB:', {
				description: String(err),
			});
		}
	},
	removeItem: async (name) => {
		if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
			return;
		}

		try {
			await del(name);
		} catch (err) {
			toast.error('Failed to remove from IndexedDB:', {
				description: String(err),
			});
		}
	},
};
