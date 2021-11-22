/* eslint-env serviceworker */
declare var self: ServiceWorkerGlobalScope;

import * as googleAnalytics from 'workbox-google-analytics';
import { matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { enable as navigationPreloadEnable } from 'workbox-navigation-preload';
import { setCacheNameDetails, clientsClaim } from 'workbox-core';
import { offlineFallback, googleFontsCache } from 'workbox-recipes';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkOnly, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

import { resetCaches } from './caches';

import type { RouteMatchCallbackOptions, RouteHandlerCallbackOptions } from 'workbox-core';

export async function init(config: SWConfig) {
	const { options } = config;
	try {
		actionvationHandler();

		self.addEventListener('message', event => {
			if (event.data && event.data.type === 'SKIP_WAITING') {
				self.skipWaiting();
			}
		});

		const cacheNames: ChacheNames = {
			images: `images_v${OFFLINE_VERSION}`,
			offline: `offline_v${OFFLINE_VERSION}`,
			pages: `pages_v${OFFLINE_VERSION}`,
			static: `static_${OFFLINE_VERSION}`,
			fonts: `fonts_${OFFLINE_VERSION}`,
		};

		// workbox.setConfig({ debug: false });

		resetCaches(cacheNames);

		navigationPreloadEnable();

		setCacheNameDetails({
			prefix: 'shop',
			precache: 'assets',
			postfix: '',
		});

		clientsClaim();

		// handlePushNotifications(self);

		if (options.cacheGoogleFonts || true) {
			googleFontsCache();
		}
		// offlineFallback({
		// pageFallback: '/_offline.html',
		// });

		googleAnalytics.initialize();

		catchHandler();

		routesHandler(caching);
	} catch (error) {
		console.error('sw: ', error);
	}
}

function actionvationHandler() {
	self.addEventListener('activate', () => {
		console.log('SW now ready to handle fetches!');
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

function routesHandler(caching: { images: Object; offline: Object }) {
	cacheAndRoute([
		...build.map(asset => {
			// console.log(`=== $service-worker build === ${asset}`);
			return {
				url: asset,
				revision: null,
			} as Entry;
		}),
		...files.map(file => {
			// console.log(`=== $service-worker files === ${file}`);
			return {
				url: file,
				revision: `${timestamp}`,
			} as Entry;
		}),
	]);
	routeResourcesNetworkFirst();
	routePagesOrServeOffline(caching.offline);
	routeAndCacheJsAndCSS(SHOP_URL); //la-mediterranee\.at/
	routeAndCacheProductImages(caching.images);
}
