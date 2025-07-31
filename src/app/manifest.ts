import { APP_DEFAULT_TITLE, APP_DESCRIPTION, APP_NAME } from '@/meta/root';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: APP_DEFAULT_TITLE,
		short_name: APP_NAME,
		description: APP_DESCRIPTION,
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/icons/manifest-icon-192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/icons/manifest-icon-192.maskable.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icons/manifest-icon-512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/icons/manifest-icon-512.maskable.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
		screenshots: [
			{
				src: '/screenshots/light.png',
				sizes: '1320x2868',
				type: 'image/png',
				label: 'Home screen - light',
			},
			{
				src: '/screenshots/dark.png',
				sizes: '1320x2868',
				type: 'image/png',
				label: 'Home screen - dark',
			},
		],
		shortcuts: [
			{
				name: 'Home Page',
				url: '/',
				description: 'Home page',
				short_name: 'Home',
				icons: [
					{
						src: '/icons/manifest-icon-192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: '/icons/manifest-icon-192.maskable.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable',
					},
					{
						src: '/icons/manifest-icon-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: '/icons/manifest-icon-512.maskable.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
		],
	};
}
