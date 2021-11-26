import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

import type { RouteMatchCallbackOptions } from 'workbox-core';
import type { HandlerOptions } from './interfaces';

interface ScriptdHandlerOptions extends HandlerOptions {}

export default function scriptsHandler(options: ScriptdHandlerOptions) {
	const {
		matcher = scriptsMatcher,
		maxEntries = 32,
		maxAgeSeconds = 14 * 24 * 60 * 60,
		purgeOnQuotaError = true,
		cacheName = 'script',
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
			: new StaleWhileRevalidate({
					cacheName: cacheName,
					plugins: [stylesExpirationPlugin],
			  }),
		method
	);
}

function scriptsMatcher(options: RouteMatchCallbackOptions) {
	return (
		options.request.destination === 'script' ||
		options.request.destination === 'worker' ||
		/\.(?:js|ts)$/i.test(options.url.pathname)
	);
}
