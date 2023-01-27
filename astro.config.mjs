import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    // site: '',
    vite: {
        build: {
            rollupOptions: {
                output: {
                    assetFileNames: "assets/style/style.[hash][extname]",
                },
            },
        },
    },
});
