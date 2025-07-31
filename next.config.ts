import withSerwistInit from '@serwist/next';
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();

const withSerwist = withSerwistInit({
	swSrc: 'src/pwa/sw.ts',
	swDest: 'public/sw.js',
});

export default withSerwist(withNextIntl(nextConfig));
