import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

import type { Route } from 'workbox-routing';
import type { RouteHandler, RouteMatchCallback } from 'workbox-core';
import type { HTTPMethod } from 'workbox-routing/utils/constants';

interface ImagesHandlerOptions {
	readonly extensionRegex?: string | RegExp | RouteMatchCallback | Route;
	readonly stragety?: RouteHandler;
	readonly maxEntries?: number;
	readonly maxAgeSeconds?: number;
	readonly purgeOnQuotaError?: boolean;
	readonly method?: HTTPMethod;
}

export default function imagesHandler(options?: ImagesHandlerOptions) {
	const {
		extensionRegex = /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
		maxEntries = 128,
		maxAgeSeconds = 60 * 24 * 60 * 60,
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
