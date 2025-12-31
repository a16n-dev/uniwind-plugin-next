"use client";
import { StyleSheet } from "react-native";
import { layerBoundaryRegex, NEW_SHEET_ID } from "./utils";

export function getServerStylesheet() {
  const sheet = (StyleSheet as any).getSheet();

  return {
    id: NEW_SHEET_ID,
    textContent: processSheetText(sheet.textContent),
  };
}

function processSheetText(text: string): string {
  const endIndex = layerBoundaryRegex.exec(text)?.index ?? 0;
  return `@layer rnw {\n${text.substring(0, endIndex)}}\n${text.substring(endIndex)}`;
}
