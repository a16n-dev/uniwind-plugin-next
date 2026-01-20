import type { NextConfig } from "next";
import { withUniwind } from "uniwind-plugin-next";
import { withExpo } from "@expo/next-adapter";
import { NormalModuleReplacementPlugin } from "webpack";

const nextConfig: NextConfig = {
  webpack(config) {
    if (!config.plugins) {
      config.plugins = [];
    }

    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /react-native-web\/dist\/exports\/StyleSheet\/dom\/createCSSStyleSheet/,
        require.resolve("react-native-web-tailwind-compat/createCSSStyleSheet"),
      ),
    );

    return config;
  },
};

export default withUniwind(withExpo(nextConfig), {
  cssEntryFile: "./src/app/globals.css",
  extraThemes: ["ocean", "sunset"],
});
