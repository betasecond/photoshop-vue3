import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import {VarletUIResolver} from "unplugin-vue-components/resolvers";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),

    AutoImport({
      imports: ['vue', 'vue-router'], // 自动引入 Vue 和 Vue Router 相关 API
      dts: 'typings/auto-imports.d.ts', // 指定类型声明文件的路径

    }),
  ],
  base: './',
  server: {
    hmr: {
      overlay: false
    }
  }
})
