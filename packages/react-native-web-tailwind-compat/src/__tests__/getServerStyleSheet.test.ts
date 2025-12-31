import { describe, it, expect } from "vitest";

import { getServerStyleSheet, processSheetText } from "../getServerStyleSheet";

describe("getServerStyleSheet", () => {
  it("should return the correct sheet ID", () => {
    const sheet = getServerStyleSheet();

    expect(sheet.id).toBe("react-native-stylesheet-layered");
  });

  it("should return textContent that includes a @layer rnw block", () => {
    const sheet = getServerStyleSheet();

    expect(sheet.textContent).toContain("@layer rnw {");
  });
});

describe("processSheetText", () => {
  it("should wrap reset styles in @layer rnw block", () => {
    const inputText = `[stylesheet-group="0"]
body { margin: 0; }
[stylesheet-group="1"]
.some-class { color: red; }
[stylesheet-group="2"]
.another-class { color: blue; }`;

    expect(processSheetText(inputText)).toBe(`@layer rnw {
[stylesheet-group="0"]
body { margin: 0; }
[stylesheet-group="1"]
.some-class { color: red; }
}
[stylesheet-group="2"]
.another-class { color: blue; }`);
  });

  it("Should include an empty layer if no reset styles are present", () => {
    const inputText = `[stylesheet-group="3"]
.some-class { color: red; }
[stylesheet-group="4"]
.another-class { color: blue; }`;
    expect(processSheetText(inputText)).toBe(`@layer rnw {
}
[stylesheet-group="3"]
.some-class { color: red; }
[stylesheet-group="4"]
.another-class { color: blue; }`);
  });
});
