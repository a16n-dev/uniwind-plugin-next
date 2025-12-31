"use client";

import { StyleSheet } from "react-native";
import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

const REACT_NATIVE_SHEET_ID = "react-native-stylesheet";
const NEW_SHEET_ID = "react-native-stylesheet-layered";

const layerBoundaryRegex = /\[stylesheet-group="[^01]"]/;

if (typeof window !== "undefined") {
  let elemProxy: HTMLStyleElement;
  const _getElementById = document.getElementById;
  document.getElementById = function (id: string) {
    if (id === REACT_NATIVE_SHEET_ID) {
      console.log("Hit");
      if (!elemProxy)
        elemProxy = { sheet: buildRNWProxy() } as HTMLStyleElement;
      return elemProxy;
    }
    return _getElementById.call(document, id);
  };

  function buildRNWProxy() {
    const { layeredSheet, flattenedSheet } = buildLinkedLayeredSheet();

    if (!layeredSheet) return flattenedSheet;

    return new Proxy(flattenedSheet, {
      get(target, prop) {
        // Override 'insert rule' to also insert into layered sheet
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

  function buildLinkedLayeredSheet() {
    const flattenedSheet = new CSSStyleSheet();
    const layeredSheet = (
      document.getElementById(NEW_SHEET_ID) as HTMLStyleElement
    )?.sheet;
    if (!layeredSheet) return { flattenedSheet };
    // ensure that the first rule in the layered sheet is a layer
    if (
      layeredSheet.cssRules.length === 0 ||
      !(layeredSheet.cssRules[0] instanceof CSSLayerBlockRule)
    ) {
      layeredSheet.insertRule("@layer rnw {}", 0);
    }
    // Traverse the layered sheet to build the flattened sheet
    const rules = [...layeredSheet.cssRules];
    while (rules.length > 0) {
      const rule = rules.shift()!;
      if (rule instanceof CSSLayerBlockRule) {
        rules.unshift(...rule.cssRules);
      } else {
        flattenedSheet.insertRule(rule.cssText, flattenedSheet.cssRules.length);
      }
    }
    return { layeredSheet, flattenedSheet };
  }
}

/**
 * Processes the stylesheet text to wrap reset styles in a `@layer rnw {}` block.
 */
function processSheetText(text: string): string {
  const endIndex = layerBoundaryRegex.exec(text)?.index;
  if (!endIndex) return text;
  return `@layer rnw {\n${text.substring(0, endIndex)}}\n${text.substring(endIndex)}`;
}

/**
 * This runs immediately on the client. It disables the actual rnw stylesheet,
 * and patches the `insertRule` method to also update our modified stylesheet.
 */
export function RNWStyleSheet() {
  const hasInserted = useRef(false);
  useServerInsertedHTML(() => {
    if (hasInserted.current) return;
    hasInserted.current = true;

    return (
      <style
        dangerouslySetInnerHTML={{
          __html: processSheetText((StyleSheet as any).getSheet().textContent),
        }}
        id={NEW_SHEET_ID}
      />
    );
  });
  return null;
}
