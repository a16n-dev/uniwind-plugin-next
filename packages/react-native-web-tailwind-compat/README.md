# react-native-web-tailwind-compat
Tailwind 4 uses CSS layers to organise styles, but react-native-web does not yet support CSS layers, resulting in  react-native-web styles overriding tailwind styles. This package fixes this by wrapping react-native-web reset styles in a `@layer rnw {}` block.

## Installation

```bash
npm install react-native-web-tailwind-compat
```

Import the package at the top of your js entry point:

```ts
// src/index.tsx
import 'react-native-web-tailwind-compat';
// Other imports...
```

Define the layer *before* importing tailwind styles:

```css
/* src/global.css */
@layer rnw;
@import 'tailwindcss';
```

## Server rendering
If you want to include react-native-web styles in SSR, use the provided `getServerStyleSheet` function, for example with Next.js:

```tsx
//ReactNativeWebStyleSheet.tsx
"use client";
import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { getServerStylesheet } from "react-native-web-tailwind-compat";

export function ReactNativeWebLayeredStyleSheet() {
    const hasInserted = useRef(false);
    useServerInsertedHTML(() => {
        if (hasInserted.current) return;
        hasInserted.current = true;
        
        const sheet = getServerStylesheet();

        return (
            <style
                id={sheet.id}
                dangerouslySetInnerHTML={{
                    __html: sheet.textContent,
                }}
                
            />
        );
    });
    return null;
}

```
