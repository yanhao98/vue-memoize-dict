import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import pkg from "./package.json" assert { type: "json" };

const config = defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
  external: ["vue-demi", "@vueuse/core"],
  plugins: [typescript()],
});

export default config;
