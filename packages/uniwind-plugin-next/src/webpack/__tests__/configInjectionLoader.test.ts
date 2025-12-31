import { describe, it, expect } from "vitest";
import loader from "../configInjectionLoader";

describe("configInjectionLoader", () => {
  it("should append Uniwind reinit to source code with themes", () => {
    const source = `console.log('Hello, world!');`;

    const result = loader.call(
      {
        query: {
          stringifiedThemes: "['light', 'dark']",
        },
      } as any,
      source,
    );

    expect(result).toBe(
      `${source}\nUniwind.__reinit(() => ({}), ['light', 'dark']);`,
    );
  });
});
