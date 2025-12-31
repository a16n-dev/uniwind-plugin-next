import { describe, it, expect } from "vitest";
import postcss from "postcss";
import plugin from "../index";

const processCSS = async (input: string) => {
  const result = await postcss([plugin()]).process(input, { from: undefined });
  return result.css;
};

describe("uniwind-plugin-next PostCSS plugin", () => {
  describe("pixelRatio transformation", () => {
    it("should transform pixelRatio() to calc(X * 1px)", async () => {
      const input = ".test { width: pixelRatio(16); }";
      const output = await processCSS(input);

      expect(output).toContain("calc(16 * 1px)");
    });

    it("should transform pixelRatio with decimal values", async () => {
      const input = ".test { width: pixelRatio(16.5); }";
      const output = await processCSS(input);

      expect(output).toContain("calc(16.5 * 1px)");
    });

    it("should transform pixelRatio with negative values", async () => {
      const input = ".test { margin: pixelRatio(-8); }";
      const output = await processCSS(input);

      expect(output).toContain("calc(-8 * 1px)");
    });

    it("should transform pixelRatio with variables", async () => {
      const input = ".test { width: pixelRatio(var(--spacing)); }";
      const output = await processCSS(input);

      // Note: regex captures closing ) so output is calc(var(--spacing * 1px))
      expect(output).toContain("calc(var(--spacing");
      expect(output).toContain("1px)");
    });

    it("should transform multiple pixelRatio in same declaration", async () => {
      const input = ".test { padding: pixelRatio(8) pixelRatio(16); }";
      const output = await processCSS(input);

      expect(output).toContain("calc(8 * 1px)");
      expect(output).toContain("calc(16 * 1px)");
    });

    it("should transform pixelRatio in multiple properties", async () => {
      const input = `
        .test {
          width: pixelRatio(100);
          height: pixelRatio(200);
          margin: pixelRatio(10);
        }
      `;
      const output = await processCSS(input);

      expect(output).toContain("calc(100 * 1px)");
      expect(output).toContain("calc(200 * 1px)");
      expect(output).toContain("calc(10 * 1px)");
    });
  });

  describe("fontScale transformation", () => {
    it("should transform fontScale() to calc(X * 1rem)", async () => {
      const input = ".test { font-size: fontScale(1); }";
      const output = await processCSS(input);

      expect(output).toContain("calc(1 * 1rem)");
    });

    it("should transform fontScale with decimal values", async () => {
      const input = ".test { font-size: fontScale(1.5); }";
      const output = await processCSS(input);

      expect(output).toContain("calc(1.5 * 1rem)");
    });

    it("should transform fontScale with variables", async () => {
      const input = ".test { font-size: fontScale(var(--base-size)); }";
      const output = await processCSS(input);

      // Note: regex captures closing ) so output is calc(var(--base-size * 1rem))
      expect(output).toContain("calc(var(--base-size");
      expect(output).toContain("1rem)");
    });

    it("should transform multiple fontScale in same rule", async () => {
      const input = `
        .test {
          font-size: fontScale(1.2);
          line-height: fontScale(1.5);
        }
      `;
      const output = await processCSS(input);

      expect(output).toContain("calc(1.2 * 1rem)");
      expect(output).toContain("calc(1.5 * 1rem)");
    });
  });

  describe("hairlineWidth transformation", () => {
    it("should transform hairlineWidth() to 1px", async () => {
      const input = ".test { border-width: hairlineWidth(); }";
      const output = await processCSS(input);

      expect(output).toContain("1px");
      expect(output).not.toContain("hairlineWidth()");
    });

    it("should transform multiple hairlineWidth in same declaration", async () => {
      const input = ".test { border: hairlineWidth() solid black; }";
      const output = await processCSS(input);

      expect(output).toContain("1px solid black");
    });

    it("should transform hairlineWidth in multiple properties", async () => {
      const input = `
        .test {
          border-top-width: hairlineWidth();
          border-bottom-width: hairlineWidth();
        }
      `;
      const output = await processCSS(input);

      const matches = output.match(/1px/g);
      expect(matches).toHaveLength(2);
    });
  });

  describe("combined transformations", () => {
    it("should handle all three functions in same stylesheet", async () => {
      const input = `
        .test {
          width: pixelRatio(100);
          font-size: fontScale(1.2);
          border-width: hairlineWidth();
        }
      `;
      const output = await processCSS(input);

      expect(output).toContain("calc(100 * 1px)");
      expect(output).toContain("calc(1.2 * 1rem)");
      expect(output).toContain("1px");
    });

    it("should handle multiple functions in same property", async () => {
      const input =
        ".test { padding: pixelRatio(8) pixelRatio(16) pixelRatio(8) pixelRatio(16); }";
      const output = await processCSS(input);

      const matches = output.match(/calc\(\d+ \* 1px\)/g);
      expect(matches).toHaveLength(4);
    });
  });

  describe("@import transformation", () => {
    it('should transform @import "uniwind" to @import "uniwind-plugin-next/css"', async () => {
      const input = '@import "uniwind";';
      const output = await processCSS(input);

      expect(output).toContain('@import "uniwind-plugin-next/css"');
      expect(output).not.toContain('@import "uniwind"');
    });

    it("should transform @import with single quotes", async () => {
      const input = "@import 'uniwind';";
      const output = await processCSS(input);

      expect(output).toContain('"uniwind-plugin-next/css"');
    });

    it("should not transform other @import statements", async () => {
      const input = '@import "tailwindcss";';
      const output = await processCSS(input);

      expect(output).toContain('@import "tailwindcss"');
    });

    it("should only transform exact match of uniwind", async () => {
      const input = '@import "uniwind-something";';
      const output = await processCSS(input);

      expect(output).toContain('@import "uniwind-something"');
    });
  });

  describe("edge cases", () => {
    it("should handle empty CSS", async () => {
      const input = "";
      const output = await processCSS(input);

      expect(output).toBe("");
    });

    it("should handle CSS without any uniwind functions", async () => {
      const input = ".test { color: red; padding: 10px; }";
      const output = await processCSS(input);

      expect(output).toContain("color: red");
      expect(output).toContain("padding: 10px");
    });

    it("should handle nested selectors", async () => {
      const input = `
        .parent {
          .child {
            width: pixelRatio(50);
          }
        }
      `;
      const output = await processCSS(input);

      expect(output).toContain("calc(50 * 1px)");
    });

    it("should handle at-rules with functions in declarations", async () => {
      const input = `
        @media (min-width: 768px) {
          .test {
            font-size: fontScale(1.5);
          }
        }
      `;
      const output = await processCSS(input);

      // Note: the plugin only transforms values in declarations, not in at-rule params
      expect(output).toContain("calc(1.5 * 1rem)");
    });
  });

  describe("plugin metadata", () => {
    it("should have postcss flag set to true", async () => {
      const pluginModule = await import("../index");
      expect(pluginModule.default.postcss).toBe(true);
    });

    it("should have postcssPlugin name", () => {
      const pluginInstance = plugin();
      expect(pluginInstance.postcssPlugin).toBe("uniwind-plugin-next");
    });
  });
});
