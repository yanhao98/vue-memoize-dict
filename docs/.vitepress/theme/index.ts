import {
  // AntDesignContainer as DemoContainer,
  // NaiveUIContainer as DemoContainer,
  ElementPlusContainer as DemoContainer,
} from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css'
import DefaultTheme from 'vitepress/theme'

import type { EnhanceAppContext } from 'vitepress'

import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    ctx.app.component('demo-preview', DemoContainer)
  }
}
