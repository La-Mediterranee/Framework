import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

import type { RouteMatchCallbackOptions } from 'workbox-core';
import type { HandlerOptions } from '../types';

interface FontsHandlerOptions extends HandlerOptions {}

export default function fontsHandler(options?: FontsHandlerOptions) {
	const {
		matcher = fontsMatcher,
		maxEntries = 32,
		maxAgeSeconds = 180 * 24 * 60 * 60,
		purgeOnQuotaError = true,
		cacheName = 'font',
		method = 'GET',
		stragety,
	} = options || {};

	const fontsExpirationPlugin = new ExpirationPlugin({
		maxEntries,
		maxAgeSeconds,
		purgeOnQuotaError,
	});

	registerRoute(
		matcher,
		stragety
			? stragety
			: new CacheFirst({
					cacheName: cacheName,
					plugins: [fontsExpirationPlugin],
			  }),
		method
	);
}

function fontsMatcher(options: RouteMatchCallbackOptions) {
	return (
		options.request.destination === 'font' ||
		/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i.test(options.url.pathname)
	);
}
