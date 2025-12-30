import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RNWStyleSheet } from "@/app/RNWStyleSheet";
import {Root} from "@/app/Root";
import { getCookie, } from 'cookies-next/server';
import { cookies } from 'next/headers';

import "./globals.css";
import {ThemeListener} from "@/app/ThemeListener";

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
  const theme = await getCookie('uniwind-theme', { cookies });

  return (
    <Root theme={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RNWStyleSheet/>
        <ThemeListener/>
        {children}
      </body>
    </Root>
  );
}
