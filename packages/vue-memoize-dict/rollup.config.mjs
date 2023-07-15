import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
// import pkg from "./package.json" assert { type: "json" };

const config = defineConfig({
  input: "src/index.ts",
  output: [
    {
      // file: pkg.main,
      file: "./dist/index.cjs",
      format: "cjs",
    },
    {
      // file: pkg.module,
      file: "./dist/index.mjs",
      format: "es",
    },
  ],
  external: ["vue-demi", "@vueuse/core"],
  plugins: [typescript()],
});

export default config;
