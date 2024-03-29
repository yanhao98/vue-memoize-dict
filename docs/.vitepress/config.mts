import { containerPreview } from '@vitepress-demo-preview/plugin'
import path from 'path'
import { defineConfig } from 'vitepress'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue Memoize Dict",
  description: "vue-memoize-dict is a Vue dictionary cache, support Vue2 and Vue3.",
  lang: 'zh-CN',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        outline: {
          label: '页面导航',
          level: 'deep'
        }
      }
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yanhao98/vue-memoize-dict' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/vue-memoize-dict' }
    ],
  },
  vite: {
    plugins: [],
    resolve: {
      alias: {
        // FIXME: 如果 index.ts 中有相对路径的引用时存在问题。
        'vue-memoize-dict': path.resolve(__dirname, '../../', 'src/index.ts'),
      },
    }
  },
  markdown: {
    lineNumbers: true,
    config(md) {
      md.use(containerPreview)
      // md.use(componentPreview)
    }
  },
  lastUpdated: true,
  sitemap: {
    hostname: 'https://vue-memoize-dict.oo1.dev'
  }
})
