import type { Compiler } from "webpack";
import path from "path";
import { buildCSS } from "./uniwind/src/css";
import { buildDtsFile } from "./uniwind/src/utils/buildDtsFile";
import { stringifyThemes } from "./uniwind/src/utils/stringifyThemes";
import { uniq } from "../common/util";
import type { UniwindConfig, uniwindPackageName } from "../common/types";

const dirname =
  typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;

export class UniwindWebpackPlugin {
  private hasRun = false;
  private readonly themes: string[];
  private readonly dtsFile: string;
  private readonly cssEntryFile: string;

  constructor(
    private readonly packageName: uniwindPackageName,
    {
      cssEntryFile,
      extraThemes = [],
      dtsFile = "uniwind-types.d.ts",
    }: UniwindConfig,
  ) {
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
      },
    );

    // Inject the uniwind reinit() call
    compiler.options.module = compiler.options.module || { rules: [] };
    compiler.options.module.rules.push({
      test: /config\.c?js$/,
      include: new RegExp(`${this.packageName}[\\/\\\\]dist`),
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
        `${this.packageName}[\\/\\\\]dist[\\/\\\\]module[\\/\\\\]components[\\/\\\\]web`,
      ),
      use: [
        {
          loader: path.resolve(dirname, "clientDirectiveLoader.js"),
        },
      ],
    });
  }
}
