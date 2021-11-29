import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

import type { RouteMatchCallbackOptions } from 'workbox-core';
import type { HandlerOptions } from '../types';

interface ImagesHandlerOptions extends HandlerOptions {}

export default function imagesHandler(options?: ImagesHandlerOptions) {
	const {
		matcher = imagesMatcher,
		maxEntries = 128,
		maxAgeSeconds = 60 * 24 * 60 * 60,
		purgeOnQuotaError = true,
		cacheName = 'image',
		method = 'GET',
		stragety,
	} = options || {};

	const stylesExpirationPlugin = new ExpirationPlugin({
		maxEntries,
		maxAgeSeconds,
		purgeOnQuotaError,
	});

	return registerRoute(
		matcher,
		stragety
			? stragety
			: new CacheFirst({
					cacheName: cacheName,
					plugins: [stylesExpirationPlugin],
			  }),
		method
	);
}

function imagesMatcher(options: RouteMatchCallbackOptions) {
	return (
		options.request.destination === 'image' ||
		/\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i.test(options.url.pathname)
	);
}
