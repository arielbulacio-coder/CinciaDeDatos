import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteSingleFile } from "vite-plugin-singlefile";

// Dos salidas:
//  - `npm run build`          → dist/          PWA instalable (service worker, offline)
//  - `npm run build:pendrive` → dist-pendrive/ un único index.html que abre con doble clic
export default defineConfig(({ mode }) => {
  const pendrive = mode === "pendrive";
  return {
    base: "./",
    plugins: [
      react(),
      pendrive
        ? viteSingleFile()
        : VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["icon.svg", "notebooks/*.ipynb"],
            manifest: {
              name: "Python para Ciencia de Datos · UADE",
              short_name: "PyCD UADE",
              description:
                "Curso virtual de Python para Ciencia de Datos (3.4.258) · Clase 10: atípicos y transformaciones.",
              lang: "es-AR",
              start_url: "./",
              scope: "./",
              display: "standalone",
              orientation: "any",
              theme_color: "#061B2C",
              background_color: "#F5F7FA",
              icons: [
                { src: "icon-192.png", sizes: "192x192", type: "image/png" },
                { src: "icon-512.png", sizes: "512x512", type: "image/png" },
                { src: "icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
              ],
            },
            workbox: {
              globPatterns: ["**/*.{js,css,html,svg,png,ipynb,csv}"],
              runtimeCaching: [
                {
                  urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
                  handler: "CacheFirst",
                  options: {
                    cacheName: "google-fonts",
                    expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                    cacheableResponse: { statuses: [0, 200] },
                  },
                },
              ],
            },
          }),
    ],
    resolve: pendrive
      ? { alias: { "virtual:pwa-register": fileURLToPath(new URL("./src/lib/pwa-stub.js", import.meta.url)) } }
      : {},
    build: { outDir: pendrive ? "dist-pendrive" : "dist" },
  };
});
