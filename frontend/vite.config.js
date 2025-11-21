import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '/birthday-letter/',   // <-- ต้องตรงกับชื่อ repo บน GitHub
  plugins: [svelte()]
});
