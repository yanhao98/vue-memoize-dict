import { defineConfig } from 'vitepress'
import path from 'path'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue Memoize Dict",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yanhao98/vue-memoize-dict' }
    ]
  },
  vite: {
    plugins: [],
    resolve: {
      alias: {
        'vue-memoize-dict': path.resolve(__dirname, '../../', 'src/index.ts'),
      },
    }
  },
  markdown: {
    lineNumbers: true,
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    }
  }
})
