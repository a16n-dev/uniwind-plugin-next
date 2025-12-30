'use client';
import {useUniwind} from "uniwind";
import {useEffect} from "react";
import {
        setCookie,
} from 'cookies-next/client';

export function ThemeListener() {

    const { theme, hasAdaptiveThemes } = useUniwind();

    useEffect(() => {
        setCookie('uniwind-theme', theme)
        setCookie('uniwind-adaptive', hasAdaptiveThemes)
    }, [theme, hasAdaptiveThemes]);

    return null;
}