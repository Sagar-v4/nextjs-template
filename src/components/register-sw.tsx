'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function RegisterServiceWorker() {
	useEffect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then(() => toast.success('Service Worker registered'))
				.catch((err) => toast.error('Service Worker registration failed', err));
		}
	}, []);

	return null;
}
