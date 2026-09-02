import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        market: resolve(__dirname, 'market.html'),
        profile: resolve(__dirname, 'profile.html'),
        kyc: resolve(__dirname, 'kyc.html'),
        suitability: resolve(__dirname, 'suitability.html'),
        admin: resolve(__dirname, 'admin.html'),
        about: resolve(__dirname, 'about.html'),
        'how-it-works': resolve(__dirname, 'how-it-works.html'),
        terms: resolve(__dirname, 'terms.html'),
        privacidade: resolve(__dirname, 'privacidade.html'),
        'protecao-investidor': resolve(__dirname, 'protecao-investidor.html'),
        offline: resolve(__dirname, 'offline.html')
      }
    }
  }
});
