import type { Route } from 'workbox-routing';
import type { RouteHandler, RouteMatchCallback } from 'workbox-core';
import type { HTTPMethod } from 'workbox-routing/utils/constants';

export interface HandlerOptions {
	readonly matcher?: string | RegExp | RouteMatchCallback | Route;
	readonly stragety?: RouteHandler;
	readonly maxEntries?: number;
	readonly maxAgeSeconds?: number;
	readonly cacheName?: string;
	readonly purgeOnQuotaError?: boolean;
	readonly method?: HTTPMethod;
}
