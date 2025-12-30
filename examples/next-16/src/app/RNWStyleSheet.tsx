'use client';

import { AppRegistry, StyleSheet } from 'react-native';

/**
 * An undocumented method that exists in react-native-web to get the
 * current stylesheet contents as text.
 * https://github.com/necolas/react-native-web/blob/fc423ba4fea944ca50ab4bbc11f8eee6511d92c5/packages/react-native-web/src/exports/StyleSheet/index.js#L144
 */
const RNStyleSheet = StyleSheet as typeof StyleSheet & {
    getSheet: () => { id: string; textContent: string };
};

const _getSheet = RNStyleSheet.getSheet;
RNStyleSheet.getSheet = function () {
    const sheet = _getSheet.call(this);

    return {
        id: 'react-native-stylesheet-uniwind',
        textContent: processSheetText(sheet.textContent),
    };
};

/**
 * Processes the stylesheet text to wrap reset styles in a `@layer rnw {}` block.
 */
function processSheetText(text: string): string {
    const endIndex = /\[stylesheet-group="[^01]"]/.exec(text)?.index;

    if (!endIndex) return text;

    return `@layer rnw {\n${text.substring(0, endIndex)}}\n${text.substring(endIndex)}`;
}

function getOrCreateStyleElement(id: string): HTMLStyleElement {
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('style');
        el.id = id;
        document.head.prepend(el);
    }
    return el as HTMLStyleElement;
}

/**
 * This runs immediately on the client. It disables the actual rnw stylesheet,
 * and patches the `insertRule` method to also update our modified stylesheet.
 */
if (typeof window !== 'undefined') {
    const rnwStyle =getOrCreateStyleElement('react-native-stylesheet');
    const newStyleElem = getOrCreateStyleElement(RNStyleSheet.getSheet().id);

    if (rnwStyle?.sheet) {
        // Disable the original stylesheet and populate the new one
        rnwStyle.sheet.disabled = true;

        const _insertRule = rnwStyle.sheet.insertRule;
        rnwStyle.sheet.insertRule = function (
            ...args: Parameters<InstanceType<typeof CSSStyleSheet>['insertRule']>
        ) {
            const res = _insertRule.apply(this, args);
            const sheet = RNStyleSheet.getSheet();
            newStyleElem.textContent = sheet.textContent;
            return res;
        };
    }
}

/**
 * From https://necolas.github.io/react-native-web/docs/rendering/#server-api
 */
export function RNWStyleSheet() {
    AppRegistry.registerComponent('App', () => () => null);

    const { getStyleElement } = (AppRegistry as any).getApplication('App', {
        initialProps: {},
    });

    return getStyleElement();
}
