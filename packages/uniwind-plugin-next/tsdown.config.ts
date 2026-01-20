import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/postcss/index.ts", "src/index.ts", "src/turbopack/index.ts"],
  format: ["cjs", "esm"],
  unbundle: true,
  dts: true,
  exports: {
    customExports(pkg) {
      if (!pkg["./css"]) pkg["./css"] = {};
      pkg["./css"].style = "./dist/uniwind/uniwind.css";
      return pkg;
    },
  },
  copy: [
    { from: "src/webpack/configInjectionLoader.js", to: "dist/webpack" },
    { from: "src/webpack/clientDirectiveLoader.js", to: "dist/webpack" },
    { from: "../../README.md", to: "." },
  ],
});
