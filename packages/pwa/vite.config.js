// ignore unused exports default

import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: './src/index.ts',
			name: 'PWA',
			formats: ['es', 'cjs'],
			fileName: format => `my-lib.${format}.js`,
		},
		outDir: 'dist',
		target: 'es2015',
	},
	esbuild: {
		legalComments: 'none',
	},
});
