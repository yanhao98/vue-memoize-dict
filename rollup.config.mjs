import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import pkg from "./package.json" assert { type: "json" };

const config = defineConfig([
  {
    input: "src/index.ts",
    // sourcemap: true,
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
    ],
  },
]);

export default config;
