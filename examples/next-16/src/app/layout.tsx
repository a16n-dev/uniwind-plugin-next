import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import { UniwindThemeProvider } from "@/app/UniwindThemeProvider";
import "./globals.css";
import { ReactNativeWebLayeredStyleSheet } from "@/app/ReactNativeWebLayeredStyleSheet";

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
  const theme = (await getCookie("uniwind-theme", { cookies })) ?? "light";
  const adaptive = await getCookie("uniwind-adaptive", { cookies });

  return (
    <html lang="en" className={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactNativeWebLayeredStyleSheet />
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
