import type { Compiler } from "webpack";
import path from "path";
import { cp } from "fs/promises";
import { UniwindConfig, uniwindPackageName } from "../common/types";
import { uniq } from "../common/util";
import { buildCSS } from "../uniwind/src/css";
import { buildDtsFile } from "../uniwind/src/utils/buildDtsFile";
import { stringifyThemes } from "../uniwind/src/utils/stringifyThemes";
import {
  UNIWIND_PACKAGE_NAME,
  UNIWIND_PRO_PACKAGE_NAME,
} from "../common/constants";

const dirname =
  typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;

export class UniwindWebpackPlugin {
  private hasRun = false;
  private readonly themes: string[];
  private readonly dtsFile: string;
  private readonly cssEntryFile: string;

  constructor({
    cssEntryFile,
    extraThemes = [],
    dtsFile = "uniwind-types.d.ts",
  }: UniwindConfig) {
    this.themes = uniq(["light", "dark", ...(extraThemes ?? [])]);
    this.dtsFile = dtsFile;
    this.cssEntryFile = cssEntryFile;
  }

  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapPromise(
      "UniwindWebpackPlugin",
      async () => {
        if (this.hasRun) return;
        this.hasRun = true;

        // 1. Generate uniwind.css
        await buildCSS(this.themes, this.cssEntryFile);

        // 2. Generate uniwind-types.d.ts
        buildDtsFile(this.dtsFile, stringifyThemes(this.themes));

        // 3. Move uniwind.css to the uniwind package dist folder
        const builtCSSPath = path.resolve(dirname, "../uniwind/uniwind.css");
        const targetCSSPath = path.join(
          path.dirname(
            require.resolve(UNIWIND_PACKAGE_NAME + "/package.json", {
              paths: [compiler.context],
            }),
          ),
          "uniwind.css",
        );

        await cp(builtCSSPath, targetCSSPath, { force: true });
      },
    );

    // Inject the uniwind reinit() call
    compiler.options.module = compiler.options.module || { rules: [] };
    compiler.options.module.rules.push({
      test: /config\.c?js$/,
      include: new RegExp(`${UNIWIND_PACKAGE_NAME}[\\/\\\\]dist`),
      use: [
        {
          loader: path.resolve(dirname, "configInjectionLoader.js"),
          options: {
            stringifiedThemes: stringifyThemes(this.themes),
          },
        },
      ],
    });
    // Add "use client" to uniwind web components
    compiler.options.module.rules.push({
      test: /\.js$/,
      exclude: /index\.js$/,
      include: new RegExp(
        `(${UNIWIND_PACKAGE_NAME}|${UNIWIND_PRO_PACKAGE_NAME})[\\/\\\\]dist`,
      ),
      use: [
        {
          loader: path.resolve(dirname, "clientDirectiveLoader.js"),
        },
      ],
    });
  }
}
