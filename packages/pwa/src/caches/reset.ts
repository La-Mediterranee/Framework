/**
 * Removes existing live caches.
 * This is to be called on swLogicInit only.
 */
export default async function resetCaches(cacheNames: string[]) {
	const keys = await caches.keys();

	return Promise.all(
		keys.map(cacheName => {
			if (Object.values(cacheNames).indexOf(cacheName) === -1) {
				console.log('[ServiceWorker] Removing old cache', cacheName);
				return caches.delete(cacheName);
			}
		})
	);
}
