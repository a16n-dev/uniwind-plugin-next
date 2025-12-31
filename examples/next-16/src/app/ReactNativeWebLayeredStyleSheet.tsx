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
        dangerouslySetInnerHTML={{
          __html: sheet.textContent,
        }}
        id={sheet.id}
      />
    );
  });
  return null;
}
