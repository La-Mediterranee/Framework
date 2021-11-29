import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

import type { RouteMatchCallback, RouteMatchCallbackOptions } from 'workbox-core';
import type { HandlerOptions } from '../types';

interface StylesHandlerOptions extends HandlerOptions {}

export default function stylesHandler(options?: StylesHandlerOptions) {
	const {
		matcher = stylesMatcher,
		maxEntries = 32,
		maxAgeSeconds = 14 * 24 * 60 * 60,
		purgeOnQuotaError = true,
		cacheName = 'style',
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
		stragety ||
			new StaleWhileRevalidate({
				cacheName: cacheName,
				plugins: [stylesExpirationPlugin],
			}),
		method
	);
}

function stylesMatcher(options: RouteMatchCallbackOptions) {
	return options.request.destination === 'style' || /\.(?:css|less|sass|scss)$/i.test(options.url.pathname);
}
