"use client";

import "./sideEffects";
import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { getServerStyleSheet } from "react-native-web-tailwind-compat";

export function ReactNativeWebStyleSheet() {
  const hasInserted = useRef(false);
  useServerInsertedHTML(() => {
    if (hasInserted.current) return;
    hasInserted.current = true;
    const sheet = getServerStyleSheet();

    return (
      <style
        dangerouslySetInnerHTML={{
          __html: sheet.textContent,
        }}
        id={sheet.id}
      />
    );
  });
  return null;
}
