"use client";

import { getCookie } from "cookies-next/client";
import { Uniwind, useUniwind } from "uniwind";
import { useEffect } from "react";
import { setCookie } from "cookies-next/client";

export type UniwindThemeProviderProps = {
  children: React.ReactNode;
  initialTheme?: string;
  initialHasAdaptiveThemes?: boolean;
};

// Set the initial theme from cookies
const themeCookie = getCookie("uniwind-theme");
const adaptiveCookie = getCookie("uniwind-adaptive");
if (themeCookie || adaptiveCookie)
  Uniwind.setTheme(adaptiveCookie === "true" ? "system" : (themeCookie as any));

export function UniwindThemeProvider({
  children,
  initialTheme,
  initialHasAdaptiveThemes,
}: UniwindThemeProviderProps) {
  const { theme, hasAdaptiveThemes } = useUniwind();

  // Set the theme for the server render
  if (
    typeof window === "undefined" &&
    (initialTheme || initialHasAdaptiveThemes)
  ) {
    Uniwind.setTheme(
      initialHasAdaptiveThemes ? "system" : (initialTheme as any),
    );
  }

  // Update cookies when theme changes
  useEffect(() => {
    setCookie("uniwind-theme", theme);
    setCookie("uniwind-adaptive", hasAdaptiveThemes);
  }, [theme, hasAdaptiveThemes]);

  return <>{children}</>;
}
