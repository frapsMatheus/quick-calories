import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
				additionalData: '@use "' + path.resolve('./src/styles/variables.scss') + '" as *;'
			}
		}
	},
	build: {
		cssMinify: true,
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				manualChunks: {
					styles: ['./src/styles/main.scss']
				}
			}
		}
	}
});
