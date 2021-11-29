import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

import type { RouteMatchCallbackOptions } from 'workbox-core';
import type { HandlerOptions } from '../types';

interface ScriptdHandlerOptions extends HandlerOptions {}

export default function scriptsHandler(options?: ScriptdHandlerOptions) {
	const {
		matcher = documentsMatcher,
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

function documentsMatcher(options: RouteMatchCallbackOptions) {
	const pathname = options.url.pathname;
	const isTranslation = !/^(.*[Ii](?:11|18)[Nn].*.(?:js|ts)$)/.test(pathname);
	return isTranslation;
}
