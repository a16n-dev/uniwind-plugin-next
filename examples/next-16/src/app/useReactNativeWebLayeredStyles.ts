"use client";
import { StyleSheet } from "react-native";

const NEW_SHEET_ID = "react-native-stylesheet-layered";

const layerBoundaryRegex = /\[stylesheet-group="[^01]"]/;

if (typeof window !== "undefined") {
  let elemProxy: HTMLStyleElement;
  const _getElementById = document.getElementById;
  document.getElementById = function (id: string) {
    return id !== "react-native-stylesheet"
      ? _getElementById.call(document, id)
      : (elemProxy ??= { sheet: buildRNWProxy() } as HTMLStyleElement);
  };

  function buildRNWProxy() {
    const flattenedSheet = new CSSStyleSheet();
    const layeredSheet = (
      document.getElementById(NEW_SHEET_ID) as HTMLStyleElement
    )?.sheet;

    if (!layeredSheet) return flattenedSheet;
    // ensure that the first rule in the layered sheet is a layer
    if (!(layeredSheet.cssRules[0] instanceof CSSLayerBlockRule)) {
      layeredSheet.insertRule("@layer rnw {}", 0);
    }
    // Traverse the layered sheet to build the flattened sheet
    flattenRules(layeredSheet.cssRules, flattenedSheet);

    return new Proxy(flattenedSheet, {
      get(target, prop) {
        if (prop === "insertRule") {
          return function insertRule(text: string, index: number) {
            flattenedSheet.insertRule(text, index);
            // find the index of the groups
            const cutoffIndex = [...flattenedSheet.cssRules].findIndex((rule) =>
              layerBoundaryRegex.exec(rule.cssText),
            );
            if (cutoffIndex === -1 || index <= cutoffIndex) {
              // insert into the layer
              const layerRule = layeredSheet.cssRules[0] as CSSLayerBlockRule;
              layerRule.insertRule(text, layerRule.cssRules.length);
            } else {
              // insert into the sheet normally
              layeredSheet.insertRule(text, layeredSheet.cssRules.length);
            }
          };
        }
        const value = (target as any)[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
  }

  function flattenRules(
    rules: CSSRuleList | CSSRule[],
    targetSheet: CSSStyleSheet,
  ) {
    for (const rule of rules) {
      if (rule instanceof CSSLayerBlockRule) {
        flattenRules(rule.cssRules, targetSheet);
      } else {
        targetSheet.insertRule(rule.cssText, targetSheet.cssRules.length);
      }
    }
  }
} else {
  const _getSheet = (StyleSheet as any).getSheet;
  (StyleSheet as any).getSheet = function () {
    const sheet = _getSheet.call(this);
    return {
      id: NEW_SHEET_ID,
      textContent: processSheetText(sheet.textContent),
    };
  };
}

/**
 * Processes the stylesheet text to wrap reset styles in a `@layer rnw {}` block.
 */
function processSheetText(text: string): string {
  const endIndex = layerBoundaryRegex.exec(text)?.index ?? 0;
  return `@layer rnw {\n${text.substring(0, endIndex)}}\n${text.substring(endIndex)}`;
}
