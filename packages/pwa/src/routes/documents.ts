import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

import type { RouteMatchCallbackOptions } from 'workbox-core';
import type { HandlerOptions } from '../types';

interface ScriptdHandlerOptions extends HandlerOptions {}

export default function scriptsHandler(options?: ScriptdHandlerOptions) {
	const {
		matcher = documentsMatcher,
		maxEntries = 64,
		maxAgeSeconds = 14 * 24 * 60 * 60,
		purgeOnQuotaError = true,
		cacheName = 'documents',
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
			: new NetworkFirst({
					cacheName: cacheName,
					plugins: [stylesExpirationPlugin],
			  }),
		method
	);
}

function documentsMatcher(options: RouteMatchCallbackOptions) {
	return (
		options.request.mode === 'navigate' ||
		options.request.destination === 'document' ||
		/\.(?:html)$/.test(options.url.pathname)
	);
}
