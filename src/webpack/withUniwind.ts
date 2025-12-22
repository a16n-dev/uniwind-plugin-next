import {Configuration, DefinePlugin, NormalModuleReplacementPlugin} from "webpack";
import path from "path";
import { UniwindConfig } from "./types";
import {UniwindWebpackPlugin} from "./UniwindWebpackPlugin";
import {uniq} from "./uniwind/src/utils/common";

export function withUniwind(nextConfig: any = {}, uniwindConfig: UniwindConfig): any {
    return {
        ...nextConfig,
        transpilePackages: uniq([...(nextConfig.transpilePackages || []), 'uniwind', 'react-native', 'react-native-web']),
        webpack(config: Configuration, options: any): Configuration {

            if (!config.resolve) config.resolve = {};
            if (!config.plugins) config.plugins = [];

            // React native compatibility config. Based on https://github.com/expo/expo-webpack-integrations/blob/main/packages/next-adapter/src/index.ts
            config.resolve.alias = {
                ...(config.resolve.alias || {}),
                // Alias internal react-native modules to react-native-web
                'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
                    'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
                'react-native/Libraries/vendor/emitter/EventEmitter$':
                    'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
                'react-native/Libraries/EventEmitter/NativeEventEmitter$':
                    'react-native-web/dist/vendor/react-native/NativeEventEmitter',
            };
            config.resolve.extensions = [
                '.web.js',
                '.web.jsx',
                '.web.ts',
                '.web.tsx',
                ...(config.resolve?.extensions ?? []),
            ];
            config.plugins.push(
                new DefinePlugin({
                    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
                })
            );

            // Rewrite imports, slightly more complex than usual because we need both:
            // Rewrite `react-native` imports to `uniwind/components/index`
            // Rewrite `react-native` imports within Uniwind components to `react-native-web`
            config.plugins.push(
                new NormalModuleReplacementPlugin(
                    /^react-native$/,
                    (resource) => {
                        const context = resource.context || '';

                        if (context.includes(`${path.sep}uniwind${path.sep}dist${path.sep}module${path.sep}components${path.sep}web`)) {
                            // Inside uniwind/dist → react-native-web
                            resource.request = 'react-native-web';
                        } else {
                            // Everywhere else → uniwnd/web
                            resource.request = 'uniwind/components/index';
                        }
                    }
                ),
            )

            config.plugins.push(new UniwindWebpackPlugin(uniwindConfig))

            // Execute the user-defined webpack config.
            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options);
            }

            return config;
        }
    }
}
