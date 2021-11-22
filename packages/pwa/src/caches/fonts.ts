import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

export default function fontshandler(maxEntries = 4, maxAgeSeconds = 604800, purgeOnQuotaError = true) {
	registerRoute(
		/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
		new StaleWhileRevalidate({
			cacheName: 'static-font-assets',
			plugins: [
				new ExpirationPlugin({
					maxEntries: maxEntries,
					maxAgeSeconds: maxAgeSeconds,
					purgeOnQuotaError: purgeOnQuotaError,
				}),
			],
		}),
		'GET'
	);
}
