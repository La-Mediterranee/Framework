import path from 'path';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	preprocess: preprocess({
		defaults: {
			markup: 'html',
			script: 'typescript',
			style: 'scss',
		},
	}),
	kit: {
		adapter: adapter(),
		target: '#svelte',
		package: {
			files,
		},
	},
};

export default config;
