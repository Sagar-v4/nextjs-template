'use client';

import { toast } from 'sonner';

export const getSWRegistration = async (): Promise<
	ServiceWorkerRegistration | undefined
> => {
	let registration: ServiceWorkerRegistration | undefined = undefined;

	if ('serviceWorker' in navigator && typeof window.serwist !== 'undefined') {
		try {
			// Get existing registration or register a new one
			registration = await navigator.serviceWorker.getRegistration();
			if (!registration) {
				registration = await window.serwist.register();
			}

			// Optionally trigger update check
			registration?.update();

			// Listen for updates to the Service Worker
			if (registration?.waiting) {
				toast.info('A new service worker is waiting to activate.');
			} else if (registration?.installing) {
				toast.info('Installing new service worker...');
			} else if (registration?.active) {
				console.info('Service Worker active:', registration.active.state);
			}
		} catch (error) {
			console.error('Service Worker registration error:', error);
			toast.error('Error during service worker registration');
		} finally {
			if (!registration) {
				toast.error('Service Worker registration failed');
			}
		}
	} else {
		toast.error('Service Worker not supported in this browser');
	}

	return registration;
};
