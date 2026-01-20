import { UniwindConfig, uniwindPackageName } from "../common/types";
import { uniq } from "../common/util";

export function withUniwindBase(
  packageName: uniwindPackageName,
  nextConfig: any = {},
  uniwindConfig: UniwindConfig,
) {
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
