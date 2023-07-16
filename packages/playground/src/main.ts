import { createApp } from "vue";
import App from "./App.vue";
import { remoteDict } from "./dict";
const app = createApp(App)

app.config.globalProperties.$remoteDict = remoteDict
declare module 'vue' {
  interface ComponentCustomProperties {
    $remoteDict: typeof remoteDict
  }
}


app.mount("#app");
