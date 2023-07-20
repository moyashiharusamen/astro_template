import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  base: '/',
  build: {
    assets: 'assets/script',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/style/[name][extname]',
          entryFileNames: `assets/script/[name].js`
        },
      },
      cssCodeSplit: true, // CSSを分割する
    },
  },
  integrations: [
    vue(),
    compress({
      css: true,
      html: true,
      img: false,
      js: true,
      svg: false,
    }),
  ],
});
