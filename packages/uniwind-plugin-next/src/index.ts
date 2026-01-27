import type { UniwindConfig } from "./common/types";
import { withUniwindBase } from "./webpack/withUniwindBase";

export function withUniwind(
  nextConfig: any = {},
  uniwindConfig: UniwindConfig,
): any {
  return withUniwindBase(nextConfig, uniwindConfig);
}
