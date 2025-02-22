import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
				additionalData: '@use "./variables.scss" as *;'
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
