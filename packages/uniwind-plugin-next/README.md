# uniwind-plugin-next

> This is an unofficial plugin, and is not affiliated with Uniwind or Next.js.

[Uniwind](https://uniwind.dev/) config plugin for Next.js. Note that only Webpack-based projects are supported, there are no plans to support Turbopack-based projects. 

The implementation of this plugin is based on the official [Uniwind Vite plugin](https://docs.uniwind.dev/quickstart#vite), and aims to match its functionality as closely as possible. All Uniwind features should work as expected - see the limitations section below for any documented differences.

## Compatibility
See the table below for tested versions of `uniwind-plugin-next` and corresponding versions of `uniwind`. Other versions of `uniwind` may work, but are not guaranteed to.

Tested on Next `16.1`, but other versions will likely work fine.

| uniwind-plugin-next | Uniwind |
|---------------------|---------|
| `1.0.0`             | `1.2.2` |

## Installation & setup
This setup guide assumes you already have a next.js project setup with Tailwind v4

1. Install uniwind and this plugin. You will probably also need `@expo/next-adapter` if you don't already have it, to handle react-native web support.

```shell
pnpm install uniwind uniwind-plugin-next @expo/next-adapter
```

2. Wrap next.js config with `withUniwind()`
```ts
// next.config.ts
import type { NextConfig } from "next";
import { withExpo } from "@expo/next-adapter";
import { withUniwind } from 'uniwind-plugin-next'

const nextConfig: NextConfig = {
    transpilePackages: ['react-native', 'react-native-web'],
};

// Wrap your config with `withUniwind()`
export default withUniwind(withExpo(nextConfig), {
    cssEntryFile: './app/globals.css',
    // Takes the same options as the vite & metro plugins.
    // See https://docs.uniwind.dev/api/metro-config#configuration-options
});
```

3. Add the postcss plugin
```js
const config = {
  plugins: {
    'uniwind-plugin-next/postcss': {}, // Add this line
    '@tailwindcss/postcss': {},
  },
};

```

4. Add `@import 'uniwind';` to the global CSS file (or wherever you `@import 'tailwindcss'`)
```css
/* src/app/globals.css */
@import 'tailwindcss';
@import 'uniwind';
```

5. Add  `suppressHydrationWarning` to root `<html>` tag (in `app/layout.tsx` by default)
```tsx
// src/app/layout.tsx
...

return (
    <html lang="en" suppressHydrationWarning>
      ...
    </html>
);
```

6. Start the dev server to generate `uniwind-types.d.ts`. Make sure that it's included in your `tsconfig.json`'s `include` array.

## SSR Considerations
- This plugin marks all Uniwind web components with `'use client'` automatically, so you do not need to do this manually.

- Be aware that some Uniwind features, such as `withUniwind` and `useResolveClassNames` will not work in a server environment, as they rely on accessing `window` or `document`.

- 

## Known limitations

- This plugin uses a much more primitive regex-based postcss plugin for transforming Uniwind CSS functions (`pixelRatio()`, `fontScale()`, `hairlineWidth()`) compared to the official Vite plugin (which uses a full AST parser). As a result, some edge cases may not be handled correctly. If you do not use these functions in your CSS, this will not impact you. If you do run into any issues, please open an issue.