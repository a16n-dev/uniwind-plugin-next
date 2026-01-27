import type { NextConfig } from "next";
import { withUniwind } from "uniwind-plugin-next";
import { withExpo } from "@expo/next-adapter";

const nextConfig: NextConfig = {
  webpack(config) {
    if (!config.plugins) {
      config.plugins = [];
    }

    return config;
  },
};

export default withUniwind(withExpo(nextConfig), {
  cssEntryFile: "./src/app/globals.css",
  extraThemes: ["ocean", "sunset"],
});
