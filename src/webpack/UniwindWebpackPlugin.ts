import {UniwindConfig} from "./types";
import type { Compiler } from 'webpack'
import {uniq} from "./utils/common";
import {stringifyThemes} from "./utils/stringifyThemes";
import {buildDtsFile} from "./utils/buildDtsFile";
import path from "path";
import {buildCSS} from "./css";
import {patchFs} from "./utils/patchFs";

export class UniwindWebpackPlugin {
    private hasRun = false
    private themes: string[]
    private dtsFile: string
    private cssEntryFile: string

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
                // See the documentation within patchFs for an explanation of what this does
                const unpatchFs = patchFs();
                await buildCSS(this.themes, this.cssEntryFile);
                unpatchFs();

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
                    loader: path.resolve(__dirname, 'configInjectionLoader.js'),
                    options: {
                        stringifiedThemes: stringifyThemes(this.themes),
                    },
                },
            ],
        });
    }
}