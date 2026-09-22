import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: '/sw-sandbox/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // 多入口：主页面（五模块） + 模块 05 拓展的 3D 推演独立入口
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        sandbox3d: fileURLToPath(new URL('./sandbox3d.html', import.meta.url))
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
