import type { NextConfig } from "next";
import { withUniwind } from "uniwind-plugin-next/turbopack";

console.log("Read config");

const nextConfig: NextConfig = {
  transpilePackages: ["react-native", "uniwind"],
  turbopack: {
    resolveAlias: {
      // Alias direct react-native imports to react-native-web
      "react-native": "react-native-web",
      // Alias internal react-native modules to react-native-web
      "react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$":
        "react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter",
      "react-native/Libraries/vendor/emitter/EventEmitter$":
        "react-native-web/dist/vendor/react-native/emitter/EventEmitter",
      "react-native/Libraries/EventEmitter/NativeEventEmitter$":
        "react-native-web/dist/vendor/react-native/NativeEventEmitter",
    },
    resolveExtensions: [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
    ],
  },
};

export default withUniwind(nextConfig, {
  cssEntryFile: "./src/app/globals.css",
  extraThemes: ["ocean", "sunset"],
});
