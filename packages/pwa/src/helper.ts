export async function getOfflinePage(cacheName = '') {
	const precache = await caches.open(cacheName);
	return precache.keys('/offline.html');
}
