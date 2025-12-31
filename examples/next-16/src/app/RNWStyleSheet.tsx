"use client";
import "./patchRnwStyles";
import { StyleSheet } from "react-native";
import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

export function RNWStyleSheet() {
  const hasInserted = useRef(false);
  useServerInsertedHTML(() => {
    if (hasInserted.current) return;
    hasInserted.current = true;
    const sheet = (StyleSheet as any).getSheet();

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
