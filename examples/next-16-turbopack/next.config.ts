import type { NextConfig } from "next";
import { withUniwind } from "uniwind-plugin-next/turbopack";
import { withExpo } from "@expo/next-adapter";

const nextConfig: NextConfig = {};

export default withUniwind(withExpo(nextConfig), {
  cssEntryFile: "./src/app/globals.css",
  extraThemes: ["ocean", "sunset"],
});
