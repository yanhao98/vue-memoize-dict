import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  minify: true,
  entry: ['./src/index.ts'],
  format: ['esm'],
  dts: true,
})
