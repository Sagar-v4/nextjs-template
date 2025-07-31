import { CacheFirst, Serwist, StaleWhileRevalidate } from 'serwist';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// "self.__SW_MANIFEST".
declare global {
	interface WorkerGlobalScope extends SerwistGlobalConfig {
		// Change this attribute's name to your `injectionPoint`.
		// `injectionPoint` is an InjectManifest option.
		// See https://serwist.pages.dev/docs/build/configuring
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
	}
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
	precacheEntries: self.__SW_MANIFEST,
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	disableDevLogs: true,
	runtimeCaching: [
		// Handle images
		{
			matcher({ request }) {
				return request.destination === 'image';
			},
			handler: new StaleWhileRevalidate({
				cacheName: 'images',
			}),
		},
		// Handle scripts
		{
			matcher({ request }) {
				return request.destination === 'script';
			},
			handler: new CacheFirst({
				cacheName: 'scripts',
			}),
		},
		// Handle styles
		{
			matcher({ request }) {
				return request.destination === 'style';
			},
			handler: new CacheFirst({
				cacheName: 'styles',
			}),
		},
	],
});

serwist.registerCapture(({ sameOrigin }) => {
	return sameOrigin;
}, new CacheFirst());

serwist.addEventListeners();
