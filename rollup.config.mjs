import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
import { defineConfig } from "rollup";
import pkg from "./package.json" assert { type: "json" };

const config = defineConfig({
  input: "src/index.ts",
  output: [
    /* {
      file: pkg.exports.require,
      format: "cjs",
    }, */
    {
      file: pkg.exports.import,
      format: "esm",
    },
  ],
  external: [
    "vue-demi",
    // "@vueuse/core"
  ],
  plugins: [
    typescript(),
    nodeResolve(),
    // commonjs(),
  ],
});

export default config;