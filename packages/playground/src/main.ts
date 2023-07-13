import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");

import { foo } from "vue-tiny-dict";
console.debug("foo :>> ", foo);
