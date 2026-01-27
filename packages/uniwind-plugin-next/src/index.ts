import type { UniwindConfig } from "./common/types";
import { withUniwindBase } from "./webpack/withUniwindBase";

export function withUniwind(
  nextConfig: any = {},
  uniwindConfig: UniwindConfig,
): any {
  return withUniwindBase("uniwind", nextConfig, uniwindConfig);
}

export function withUniwindPro(
  nextConfig: any = {},
  uniwindConfig: UniwindConfig,
): any {
  return withUniwindBase("uniwind-pro", nextConfig, uniwindConfig);
}
