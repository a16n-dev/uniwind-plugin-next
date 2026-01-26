# uniwind-plugin-next

[Uniwind](https://uniwind.dev/) config plugin for Next.js projects using Webpack. Turbopack is not supported at this stage.

## Example
See a fully working example project here: [Demo](http://uniwind-next.a16n.dev/) ([Source](https://github.com/a16n-dev/uniwind-plugin-next/tree/main/examples/next-16))


## Compatibility
See the table below for tested versions of `uniwind-plugin-next` and corresponding versions of `uniwind`. Other versions of `uniwind` may work, but are not guaranteed to.

Tested on Next `16.1`, but other versions will likely work fine.

| Uniwind           | uniwind-plugin-next |
|-------------------|---------------------|
| `1.2.2`-`1.2.3`   | `1.1.0`-`1.2.0`     |
| `1.2.4` - `1.2.6` | `1.3.0`             |

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

## Uniwind Pro

If you're using the pro version of Uniwind, use `withUniwindPro()` instead of `withUniwind()`.

```ts
// next.config.ts
import { withUniwindPro } from 'uniwind-plugin-next'

export default withUniwindPro(withExpo(nextConfig), { ... });
```


## SSR Considerations
- This plugin marks all Uniwind web components with `'use client'` automatically, so you do not need to do this manually.

- Be aware that some Uniwind features, such as `withUniwind` and `useResolveClassNames` will not work in a server environment, as they rely on accessing `window` or `document`.

- Additional code is required to avoid a flash of unstyled content (FOUC). See the example project for reference.