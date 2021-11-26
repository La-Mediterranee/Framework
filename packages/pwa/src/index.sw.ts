/* eslint-env serviceworker */
import { initialize as initGA } from 'workbox-google-analytics';
import { matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { enable as navigationPreloadEnable } from 'workbox-navigation-preload';
import { setCacheNameDetails, clientsClaim } from 'workbox-core';
import { offlineFallback, googleFontsCache } from 'workbox-recipes';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkOnly, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

import Logger from './Logger';
import { resetCaches } from './caches';

import type { RouteMatchCallbackOptions, RouteHandlerCallbackOptions } from 'workbox-core';

declare var self: PlatformSWScope;

self.logger = self.logger || new Logger();

export async function init(config: SWConfig) {
	const { options } = config;
	try {
		activationHandler();
		skipWaitHandler();

		const cacheNames: ChacheNames = {
			images: `images_v${OFFLINE_VERSION}`,
			offline: `offline_v${OFFLINE_VERSION}`,
			pages: `pages_v${OFFLINE_VERSION}`,
			static: `static_${OFFLINE_VERSION}`,
			fonts: `fonts_${OFFLINE_VERSION}`,
		};

		// workbox.setConfig({ debug: false });

		resetCaches(Object.values(cacheNames));

		navigationPreloadEnable();

		setCacheNameDetails({
			prefix: 'shop',
			precache: 'assets',
			postfix: '',
		});

		clientsClaim();

		if (options.cacheGoogleFonts || true) {
			googleFontsCache();
		}

		if (config.enableGoogleAnalytics) {
			initGA();
		}

		// offlineFallback({
		// pageFallback: '/_offline.html',
		// });

		catchHandler();
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

function catchHandler() {
	setCatchHandler(async e => {
		// Return the precached offline page if a document is being requested
		if (e.request.destination === 'document') {
			return (await matchPrecache('/offline.html')) || Response.error();
		}

		return Response.error();
		// return new Response(null, { status: 404 });
	});
}
