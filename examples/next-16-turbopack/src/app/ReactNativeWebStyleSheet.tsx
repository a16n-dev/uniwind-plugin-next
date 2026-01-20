"use client";

import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

export function ReactNativeWebStyleSheet() {
  const hasInserted = useRef(false);
  useServerInsertedHTML(() => {
    if (hasInserted.current) return;
    hasInserted.current = true;

    return <style />;
  });
  return null;
}
