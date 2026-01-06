"use client";
import { StyleSheet } from "react-native";

const NEW_SHEET_ID = "react-native-stylesheet-layered";
const layerBoundaryRegex = /\[stylesheet-group="[^01]"]/;

export function getServerStyleSheet() {
  const sheet = (StyleSheet as any).getSheet();

  return {
    id: NEW_SHEET_ID,
    textContent: processSheetText(sheet.textContent),
  };
}

export function processSheetText(text: string): string {
  const endIndex = layerBoundaryRegex.exec(text)?.index ?? 0;
  return `@layer rnw {\n${text.substring(0, endIndex)}}\n${text.substring(endIndex)}`;
}
