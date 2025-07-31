import withSerwistInit from '@serwist/next';
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();

const withSerwist = withSerwistInit({
	swSrc: 'src/pwa/sw.ts',
	swDest: 'public/sw.js',
	reloadOnOnline: true,
	cacheOnNavigation: true,
	globPublicPatterns: ['**/*.{js,css,html,png,svg}'],
});

export default withSerwist(withNextIntl(nextConfig));
