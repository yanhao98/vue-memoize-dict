import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import pkg from "./package.json" assert { type: "json" };
// import { terser } from 'rollup-plugin-terser';
// import cleanup from 'rollup-plugin-cleanup';

const config = defineConfig([
  {
    input: "src/index.ts",
    output: [
      { format: "esm", file: pkg.main, sourcemap: true },
    ],
    external: [
      "vue-demi",
      // "@vueuse/core"
    ],
    plugins: [
      typescript({
        rootDir: "src",
        declaration: true,
        declarationDir: pkg.typings.replace(/\/[^/]+$/, ""),
      }),
      nodeResolve(),
      // cleanup(),
      // terser(),
    ],
  },
]);

export default config;
