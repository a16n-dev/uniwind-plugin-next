import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/postcss/index.ts", "src/index.ts"],
  format: ["cjs", "esm"],
  unbundle: true,
  dts: true,
  exports: true,
  copy: [
    { from: "src/webpack/configInjectionLoader.js", to: "dist/webpack" },
    { from: "src/webpack/clientDirectiveLoader.js", to: "dist/webpack" },
    { from: "../../README.md", to: "." },
  ],
});
