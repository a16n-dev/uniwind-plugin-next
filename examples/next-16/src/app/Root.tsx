'use client';
import {Uniwind} from "uniwind";

export function Root({children, theme, adaptive}: {children: React.ReactNode, theme?: string, adaptive?: boolean}) {

    console.log(`Initial theme is ${theme} (adaptive: ${adaptive})`)

    if(theme || adaptive) {
        // Ensure the theme is set on the server
        Uniwind.setTheme(adaptive ? 'system' : theme as any);
    }

    return <html lang="en" className={theme}>{children}</html>
}