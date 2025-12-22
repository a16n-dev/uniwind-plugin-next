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

1. Install the package

2. Wrap next.js config with `withUniwind()`

3. Add the postcss plugin

4. Add `@import 'uniwind';` to global CSS file

5. Add  `suppressHydrationWarning` to root `<html>` tag

## Known limitations

- This plugin uses a much more primitive regex-based postcss plugin for transforming Uniwind CSS functions (`pixelRatio()`, `fontScale()`, `hairlineWidth()`) compared to the official Vite plugin (which uses a full AST parser). As a result, some edge cases may not be handled correctly. If you do not use these functions in your CSS, this will not impact you. If you do run into any issues, please open an issue.