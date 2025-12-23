import {UniwindConfig} from "./types";
import type { Compiler } from 'webpack'
import path from "path";
import {uniq} from "./uniwind/src/utils/common";
import { patchFsForWritingUniwindCSSFile } from "./patchFsForWritingUniwindCSSFile";
import {buildCSS} from "./uniwind/src/css";
import {buildDtsFile} from "./uniwind/src/utils/buildDtsFile";
import {stringifyThemes} from "./uniwind/src/utils/stringifyThemes";

const dirname = typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname

export class UniwindWebpackPlugin {
    private hasRun = false
    private readonly themes: string[]
    private readonly dtsFile: string
    private readonly cssEntryFile: string

    constructor({
                    cssEntryFile,
                    extraThemes = [],
                    dtsFile = 'uniwind-types.d.ts',
                }: UniwindConfig) {
      this.themes = uniq([
          'light',
          'dark',
          ...(extraThemes ?? []),
      ]);
      this.dtsFile = dtsFile
      this.cssEntryFile = cssEntryFile
    }

    apply(compiler: Compiler) {
        compiler.hooks.beforeCompile.tapPromise(
            'UniwindWebpackPlugin',
            async () => {
                if (this.hasRun) return
                this.hasRun = true

                // 1. Generate uniwind.css
                const removePatch = patchFsForWritingUniwindCSSFile();
                await buildCSS(this.themes, this.cssEntryFile);
                removePatch();

                // 2. Generate uniwind-types.d.ts
                buildDtsFile(this.dtsFile, stringifyThemes(this.themes))
            },
        )

        // Setup a custom loader to inject the uniwind config
        compiler.options.module = compiler.options.module || { rules: [] }
        compiler.options.module.rules.push({
            test: /config\.c?js$/,
            include: /uniwind[\/\\]dist/,
            use: [
                {
                    loader: path.resolve(dirname, 'configInjectionLoader.js'),
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
            include: /uniwind[\/\\]dist[\/\\]module[\/\\]components[\/\\]web/,
            use: [
                {
                    loader: path.resolve(dirname, 'clientDirectiveLoader.js'),
                },
            ],
        })
    }
}