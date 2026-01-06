"use client";
import { layerBoundaryRegex, NEW_SHEET_ID } from "./utils";

let proxy: CSSStyleSheet | null = null;

export function getSheet(): CSSStyleSheet {
  return (proxy ??= buildRNWProxy());
}

function buildRNWProxy() {
  const flattenedSheet = new CSSStyleSheet();
  let layeredSheet = (document.getElementById(NEW_SHEET_ID) as HTMLStyleElement)
    ?.sheet;

  if (!layeredSheet) {
    const styleElem = document.createElement("style");
    styleElem.id = NEW_SHEET_ID;
    document.head.prepend(styleElem);
    layeredSheet = styleElem.sheet;
  }
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
