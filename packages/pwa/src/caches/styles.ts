import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

import type { Route } from 'workbox-routing';
import type { RouteHandler, RouteMatchCallback } from 'workbox-core';
import type { HTTPMethod } from 'workbox-routing/utils/constants';

interface StylesHandlerOptions {
	readonly extensionRegex?: string | RegExp | RouteMatchCallback | Route;
	readonly stragety?: RouteHandler;
	readonly maxEntries?: number;
	readonly maxAgeSeconds?: number;
	readonly purgeOnQuotaError?: boolean;
	readonly method?: HTTPMethod;
}

export default function stylesHandler(options?: StylesHandlerOptions) {
	const {
		extensionRegex = /\.(?:css|less|sass|scss)$/i,
		maxEntries = 32,
		maxAgeSeconds = 14 * 24 * 60 * 60,
		purgeOnQuotaError = true,
		method = 'GET',
		stragety,
	} = options || {};

	const stylesExpirationPlugin = new ExpirationPlugin({
		maxEntries,
		maxAgeSeconds,
		purgeOnQuotaError,
	});

	return registerRoute(
		extensionRegex,
		stragety
			? stragety
			: new StaleWhileRevalidate({
					cacheName: 'static-style-assets',
					plugins: [stylesExpirationPlugin],
			  }),
		method
	);
}
