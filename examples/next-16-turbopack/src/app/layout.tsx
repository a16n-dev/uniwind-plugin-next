declare global {
  // eslint-disable-next-line no-var
  var __DEV__: boolean | undefined;
}

globalThis.__DEV__ = process.env.NODE_ENV !== "production";
export {};

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import { UniwindThemeProvider } from "@/app/UniwindThemeProvider";
import { ReactNativeWebStyleSheet } from "./ReactNativeWebStyleSheet";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next with Uniwind",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the theme from cookies to support SSR with the correct theme
  const theme = (await getCookie("uniwind-theme", { cookies })) ?? "dark";
  const adaptive = await getCookie("uniwind-adaptive", { cookies });

  return (
    <html lang="en" className={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactNativeWebStyleSheet />
        <UniwindThemeProvider
          initialTheme={theme}
          initialHasAdaptiveThemes={adaptive === "true"}
        >
          {children}
        </UniwindThemeProvider>
      </body>
    </html>
  );
}
