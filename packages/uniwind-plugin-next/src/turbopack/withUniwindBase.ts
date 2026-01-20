import { UniwindConfig, uniwindPackageName } from "../common/types";
import { uniq } from "../common/util";
import { buildCSS } from "../uniwind/src/css";
import { buildDtsFile } from "../uniwind/src/utils/buildDtsFile";
import { stringifyThemes } from "../uniwind/src/utils/stringifyThemes";

export function withUniwindBase(
  packageName: uniwindPackageName,
  nextConfig: any = {},
  uniwindConfig: UniwindConfig,
) {
  const {
    cssEntryFile,
    extraThemes = [],
    dtsFile = "uniwind-types.d.ts",
  } = uniwindConfig;

  const themes = uniq(["light", "dark", ...extraThemes]);

  console.log("Called!");
  // 1. Generate uniwind.css
  buildCSS(themes, cssEntryFile);

  // 2. Generate uniwind-types.d.ts
  buildDtsFile(dtsFile, stringifyThemes(themes));

  return {
    ...nextConfig,
    transpilePackages: uniq([
      ...(nextConfig.transpilePackages || []),
      packageName,
      "react-native",
      "react-native-web",
    ]),
  };
}
