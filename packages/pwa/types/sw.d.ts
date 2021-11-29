import type { Strategy } from 'workbox-strategies';

interface ChacheNames {
	/** html files in the static folder or prerendered pages from sveltekit */
	readonly pages: string;
	/** generated js and css files from sveltekit */
	readonly static: string;
	readonly fonts: string;
	/** images from cdns, storages, etc. saved in IndexedDB */
	readonly images: string;
	/** offline Page */
	readonly offline: string;
}

interface StoragePaths {
	readonly root: string;
	readonly jsScope: string;
	readonly cssScope: string;
	readonly imgScope: string;
	readonly offlinePage: string;
}

interface SWConfig {
	version: number | string;
	paths: StoragePaths;
	isBrowserNavigationEnabled: boolean;
	warm?: {
		urls: string[];
		strategy?: Strategy;
	};
	options: {
		cacheGoogleFonts?: boolean;
		enableGoogleAnalytics?: boolean;
		enableNaviagtionPreload?: boolean;
	};
}
