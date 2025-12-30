'use client';
import {Uniwind} from "uniwind";

export function Root({children, theme}: {children: React.ReactNode, theme?: string}) {

    if(typeof window === 'undefined' && theme) {
        // Ensure the theme is set on the server
        Uniwind.setTheme(theme as any);
    }

    return <html lang="en" className={Uniwind.currentTheme}>{children}</html>
}