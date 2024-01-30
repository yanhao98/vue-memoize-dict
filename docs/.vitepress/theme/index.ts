import DefaultTheme from 'vitepress/theme'
import {
  // AntDesignContainer as DemoContainer,
  ElementPlusContainer as DemoContainer,
  // NaiveUIContainer as DemoContainer,
} from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css'
import type { EnhanceAppContext } from 'vitepress'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    ctx.app.component('demo-preview', DemoContainer)
  }
}
