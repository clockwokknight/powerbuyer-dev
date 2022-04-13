import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/scss/_variables.scss";`
  //     },
  //   },
  // },
  plugins: [vue(), vueJsx()],
});
