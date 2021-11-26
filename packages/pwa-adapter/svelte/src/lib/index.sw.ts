declare var self: ServiceWorkerGlobalScope;

interface Entry {
	url: string;
	revision: string | null;
}

interface SWModule {
	readonly build?: string[];
	readonly files?: string[];
	readonly timestamp?: number;
}

export function init({ build = [], files = [], timestamp }: SWModule) {
	return [
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
	];
}
