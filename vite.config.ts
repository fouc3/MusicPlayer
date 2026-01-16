import { defineConfig } from 'vite'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte({
        preprocess: vitePreprocess()
    })],
    build: {
        outDir: 'dist',
        lib: {
            entry: 'src/main.ts',
            name: 'HexoMusicPlayer',
            fileName: (format) => `music-player.${format}.js`,
            formats: ['iife']
        },
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') return 'style.css';
                    return assetInfo.name;
                }
            }
        }
    }
})
