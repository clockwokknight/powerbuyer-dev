import { createApp } from "vue";

import axios from "axios";
import { router } from "@/routes";
import { VueQueryPlugin } from "vue-query";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";

//UI framework
import naive from "naive-ui";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

//Tippy Tooltips
import VueTippy from "vue-tippy";

import App from "./App.vue";

//Tailwind CSS
import "./scss/index.scss";

//Pinia
import { createPinia } from "pinia";

//Custom Directives
import mask from "@/directives/mask";
import ObserveVisibility from "@/directives/observe-visibility";

axios.defaults.baseURL = "https://gmtvinventory.com/api";

/**
 *
 * @type VueQueryPluginOptions
 */
const vueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
};

createApp(App)
  .use(createPinia())
  .use(naive)
  .directive("mask", mask)
  .directive("observe-visibility", ObserveVisibility)
  .use(VueTippy)
  .use(VueQueryPlugin, vueQueryPluginOptions)
  .use(router)
  .mount("#app");
