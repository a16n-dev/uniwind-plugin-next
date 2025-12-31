import { describe, it, expect } from "vitest";
import loader from "../clientDirectiveLoader";

describe("clientDirectiveLoader", () => {
  it("should prepend use client directive to source code", () => {
    const source = `console.log('Hello, world!');`;

    const result = loader.call({} as any, source);

    expect(result).toBe(`"use client";\n${source}`);
  });

  it("Should not prepend use client directive if already present", () => {
    const source = `"use client";\nconsole.log('Hello, world!');`;

    const result = loader.call({} as any, source);

    expect(result).toBe(source);
  });
});
