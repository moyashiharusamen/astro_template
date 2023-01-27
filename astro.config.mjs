import { defineConfig } from 'astro/config';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
    vite: {
        build: {
            rollupOptions: {
                output: {
                    assetFileNames: 'assets/style/style.[hash][extname]',
                },
            },
        },
    },
    integrations: [
		compress({
			css: true,
			html: true,
			img: false,
			js: false,
			svg: false,
		}),
	],
});
