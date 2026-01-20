import webpack from "webpack";
import type { Configuration } from "webpack";
import path from "path";
import { UniwindConfig } from "./types";
import { UniwindWebpackPlugin } from "./UniwindWebpackPlugin";

const { NormalModuleReplacementPlugin } = webpack;

export function withUniwind(
  nextConfig: any = {},
  uniwindConfig: UniwindConfig,
): any {
  return {
    ...nextConfig,
    transpilePackages: uniq([
      ...(nextConfig.transpilePackages || []),
      "uniwind",
      "react-native",
      "react-native-web",
    ]),
    webpack(config: Configuration, options: any): Configuration {
      if (!config.plugins) config.plugins = [];

      // Rewrite imports, slightly more complex than usual because we need both:
      // Rewrite `react-native` imports to `uniwind/components/index`
      // Rewrite `react-native` imports within Uniwind components to `react-native-web`
      config.plugins.push(
        new NormalModuleReplacementPlugin(/^react-native$/, (resource) => {
          const context = resource.context || "";

          if (
            context.includes(
              `${path.sep}uniwind${path.sep}dist${path.sep}module${path.sep}components${path.sep}web`,
            )
          ) {
            // Inside uniwind/dist → react-native-web
            resource.request = "react-native-web";
          } else {
            // Everywhere else → uniwnd/web
            resource.request = "uniwind/components/index";
          }
        }),
      );

      config.plugins.push(new UniwindWebpackPlugin(uniwindConfig));

      // Execute the user-defined webpack config.
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
}

const uniq = <T>(arr: Array<T>) => Array.from(new Set(arr));
