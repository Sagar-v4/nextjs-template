import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/indexedDbStorage';

interface CounterState {
	counter: number;
	increment: () => void;
	decrement: () => void;
	reset: () => void;
}

export const useCounterStore = create<CounterState>()(
	persist(
		(set) => ({
			counter: 0,
			increment: () => set((state) => ({ counter: state.counter + 1 })),
			decrement: () => set((state) => ({ counter: state.counter - 1 })),
			reset: () => set({ counter: 0 }),
		}),
		{
			name: 'app-store',
			storage: createJSONStorage(() => indexedDBStorage),
		},
	),
);
