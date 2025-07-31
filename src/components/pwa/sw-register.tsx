'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { getSWRegistration } from '@/pwa/sw-register';

interface Props {
	registerManually?: boolean;
}

export function ServiceWorkerRegister({ registerManually }: Props) {
	useEffect(() => {
		if (!registerManually) return;
		const handleLoad = () => {
			getSWRegistration().then((registration) => {
				if (registration) {
					toast.success('Service Worker registered');

					// Optional: Listen for updates to show update UI or reload
					if (registration.waiting) {
						toast.info('A new update is ready. Refresh to apply.');
					}

					// Listen for an updatefound event
					registration.addEventListener('updatefound', () => {
						const newWorker = registration.installing;
						if (newWorker) {
							newWorker.addEventListener('statechange', () => {
								if (
									newWorker.state === 'installed' &&
									navigator.serviceWorker.controller
								) {
									toast.info('A new version is available. Please refresh.');
								}
							});
						}
					});
				}
			});
		};

		if ('serviceWorker' in navigator) {
			window.addEventListener('load', handleLoad);
		}

		return () => {
			window.removeEventListener('load', handleLoad);
		};
	}, [registerManually]);

	return null;
}
