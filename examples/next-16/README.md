# Next.js with Uniwind

This is an example demonstrating how to use Next.js with Uniwind, with full support for themes & server-side rendering (SSR).

## Themes
This example uses cookies to persist the selected theme. This allows the server to render the correct theme on the initial page load, at the cost of forcing `_layout.tsx` to be rendered dynamically on every request.

## React-native-web styles
By default, `react-native-web` injects styles on the client, leading to a flash of unstyled content (FOUC) on the initial page load. To avoid this, we can inject the react-native-web styles on the server. See the implementation of `src/app/ReactNativeWebStyleSheet.tsx` for details.
