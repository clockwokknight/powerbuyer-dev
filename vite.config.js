import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: "esnext",
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@import "@/scss/_variables.scss";`
    //     },
    //   },
    // },
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: [{
                find: "@",
                replacement: path.resolve(__dirname, "src"),
            },
            {
                find: "dynamsoft-javascript-barcode",
                replacement: require.resolve(
                    "dynamsoft-javascript-barcode/dist/dbr.browser.mjs"
                ),
            },
        ],
    },
});