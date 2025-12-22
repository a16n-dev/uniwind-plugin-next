# uniwind-plugin-next

> This is an unofficial plugin, and is not affiliated with Uniwind or Next.js in any way.

Next.js plugin for [Uniwind](https://uniwind.dev/) support. Note that only Webpack-based projects are supported, and there are no plans to support Turbopack. 

The implementation of this plugin is based on the official [Uniwind Vite plugin](https://docs.uniwind.dev/quickstart#vite), and aims to match its functionality as closely as possible. See the limitations section below for known differences.

## Compatibility
See the table below for tested versions of `uniwind-plugin-next` and corresponding versions of `uniwind`. Other versions may work, but are not guaranteed to.

_Tested on `next` version `16.1`, but other versions will likely work fine._

| uniwind-plugin-next | Uniwind |
|---------------------|---------|
| `1.0.0`             | `1.2.2` |

## Installation & setup
This setup guide assumes you already have a next.js project setup with Tailwind v4

1. Install uniwind and this plugin:

```shell
pnpm install uniwind uniwind-plugin-next
```

2. Wrap next.js config with `withUniwind()`
```ts
// next.config.ts
import type { NextConfig } from "next";
import { withUniwind } from 'uniwind-plugin-next'

const nextConfig: NextConfig = {};

// Wrap your config with `withUniwind()`
export default withUniwind(nextConfig, {
    cssEntryFile: './app/globals.css',
    // Takes the same options as the vite & metro plugins.
    // See https://docs.uniwind.dev/api/metro-config#configuration-options
});

```

3. Add the postcss plugin
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    'uniwind-plugin-next/postcss': {}, // Add this line
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

## Known limitations

- This plugin uses a much more primitive regex-based postcss plugin for transforming Uniwind CSS functions (`pixelRatio()`, `fontScale()`, `hairlineWidth()`) compared to the official Vite plugin (which uses a full AST parser). As a result, some edge cases may not be handled correctly. If you do not use these functions in your CSS, this will not impact you. If you do run into any issues, please open an issue.