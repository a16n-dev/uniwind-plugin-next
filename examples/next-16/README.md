# Instructions

1. Install this plugin along with uniwind (assuming you already have tailwind v4 setup and installed correctly)
```shell
pnpm i uniwind uniwind-plugin-next
```

2. Wrap your Next.js config with the plugin:
```ts
import type { NextConfig } from "next";
import {withUniwind} from 'uniwind-plugin-next';

const nextConfig: NextConfig = {
    turbopack: {},
};

export default withUniwind(nextConfig, {
    cssEntryFile: './app/globals.css',
    // Takes the same options as the vite & metro plugins
});
```