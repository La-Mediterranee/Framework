/* eslint-env serviceworker */
import { initialize as initGA } from 'workbox-google-analytics';
import { matchPrecache } from 'workbox-precaching';
import { setCatchHandler } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { enable as navigationPreloadEnable } from 'workbox-navigation-preload';
import { setCacheNameDetails, clientsClaim, RouteHandlerCallbackOptions } from 'workbox-core';
import { googleFontsCache, warmStrategyCache } from 'workbox-recipes';

import Analytics from './Analytics';
import { registerRoutes, resetCaches } from './routes';

import type { SWConfig } from '../types/sw';

declare var self: PlatformSWScope;

self.analytics = self.analytics || new Analytics();

export async function init(config: SWConfig) {
	const { options } = config;
	try {
		activationHandler();
		skipWaitHandler();

		const cacheNames: string[] = [];

		resetCaches(cacheNames);

		warmStrategyCache({
			urls: config.warm?.urls || ['/offline.html', '/placeholder.svg'],
			strategy: config.warm?.strategy || new CacheFirst(),
		});

		registerRoutes();

		navigationPreloadEnable();

		setCacheNameDetails({
			prefix: 'shop',
			precache: 'assets',
			postfix: '',
		});

		clientsClaim();

		setCatchHandler(e =>
			catchHandler(e, {
				font: '',
				html: '',
				image: '',
				script: '',
			})
		);

		if (options.cacheGoogleFonts ?? true) {
			googleFontsCache();
		}

		if (options.enableGoogleAnalytics ?? true) {
			initGA();
		}

		if (options.enableNaviagtionPreload ?? true) {
			navigationPreloadEnable();
		}
	} catch (error) {
		console.error('sw: ', error);
	}
}

function activationHandler() {
	self.addEventListener('activate', () => {
		console.log('SW now ready to handle fetches!');
	});
}

function skipWaitHandler() {
	self.addEventListener('message', event => {
		if (event.data && event.data.type === 'SKIP_WAITING') {
			self.skipWaiting();
		}
	});
}

interface FallbackUrls {
	html: string;
	image: string;
	font: string;
	script: string;
}

async function catchHandler(e: RouteHandlerCallbackOptions, fallbackUrls: FallbackUrls) {
	// The FALLBACK_URL entries must be added to the cache ahead of time, either
	// via runtime or precaching. If they are precached, then call
	// `matchPrecache(FALLBACK_URL)` (from the `workbox-precaching` package)
	// to get the response from the correct cache.
	//
	// Use event, request, and url to figure out how to respond.
	// One approach would be to use request.destination, see
	// https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
	switch (e.request.destination) {
		case 'document': {
			// If using precached URLs:
			// return matchPrecache(FALLBACK_HTML_URL);
			const match = await caches.match(fallbackUrls.html);
			if (match) return match;
			break;
		}
		case 'image': {
			// If using precached URLs:
			// return matchPrecache(FALLBACK_IMAGE_URL);
			const match = await caches.match(fallbackUrls.image);
			if (match) return match;
			break;
		}
		case 'font': {
			// If using precached URLs:
			// return matchPrecache(FALLBACK_FONT_URL);
			const match = await caches.match(fallbackUrls.font);
			if (match) return match;
			break;
		}
		case 'script': {
			// If using precached URLs:
			// return matchPrecache(FALLBACK_IMAGE_URL);
			const match = await caches.match(fallbackUrls.script);
			if (match) return match;
			break;
		}
	}
	// If we don't have a fallback, just return an error response.
	return Response.error();
}
