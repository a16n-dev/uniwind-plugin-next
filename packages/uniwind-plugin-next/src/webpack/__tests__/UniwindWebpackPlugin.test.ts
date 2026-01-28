import { describe, it, expect, vi, beforeEach } from "vitest";
import { UniwindWebpackPlugin } from "../UniwindWebpackPlugin";
import type { Compiler } from "webpack";

const PACKAGE_NAME = "uniwind";

// Mock the dependencies
vi.mock("../../uniwind/src/css", () => ({
  buildCSS: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../uniwind/src/utils/buildDtsFile", () => ({
  buildDtsFile: vi.fn(),
}));

vi.mock("../../uniwind/src/utils/stringifyThemes", () => ({
  stringifyThemes: vi.fn(
    (themes) => `[${themes.map((t: string) => `'${t}'`).join(", ")}]`,
  ),
}));

vi.mock("fs/promises", () => ({
  cp: vi.fn().mockResolvedValue(undefined),
}));

describe("UniwindWebpackPlugin", () => {
  let mockCompiler: Compiler;
  let beforeCompileCallback: () => Promise<void>;

  beforeEach(() => {
    vi.clearAllMocks();

    beforeCompileCallback = vi.fn();
    mockCompiler = {
      context: process.cwd(),
      hooks: {
        beforeCompile: {
          tapPromise: vi.fn((name, callback) => {
            beforeCompileCallback = callback;
          }),
        },
      },
      options: {
        module: {
          rules: [],
        },
      },
    } as any;
  });

  describe("constructor", () => {
    it("should initialize with default themes when no extraThemes provided", () => {
      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
      });

      expect(plugin).toBeInstanceOf(UniwindWebpackPlugin);
    });

    it("should merge extraThemes with default themes", () => {
      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
        extraThemes: ["brand", "custom"],
      });

      expect(plugin).toBeInstanceOf(UniwindWebpackPlugin);
    });

    it("should deduplicate themes", () => {
      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
        extraThemes: ["light", "dark", "brand"],
      });

      expect(plugin).toBeInstanceOf(UniwindWebpackPlugin);
    });

    it("should use default dtsFile when not provided", () => {
      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
      });

      expect(plugin).toBeInstanceOf(UniwindWebpackPlugin);
    });

    it("should use custom dtsFile when provided", () => {
      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
        dtsFile: "custom-types.d.ts",
      });

      expect(plugin).toBeInstanceOf(UniwindWebpackPlugin);
    });
  });

  describe("apply", () => {
    it("should register beforeCompile hook", () => {
      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
      });

      plugin.apply(mockCompiler);

      expect(mockCompiler.hooks.beforeCompile.tapPromise).toHaveBeenCalledWith(
        "UniwindWebpackPlugin",
        expect.any(Function),
      );
    });

    it("should generate CSS and DTS files on beforeCompile", async () => {
      const { buildCSS } = await import("../../uniwind/src/css");
      const { buildDtsFile } =
        await import("../../uniwind/src/utils/buildDtsFile");
      const { stringifyThemes } =
        await import("../../uniwind/src/utils/stringifyThemes");

      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
        extraThemes: ["brand"],
        dtsFile: "types.d.ts",
      });

      plugin.apply(mockCompiler);
      await beforeCompileCallback();

      expect(buildCSS).toHaveBeenCalledWith(
        expect.arrayContaining(["light", "dark", "brand"]),
        "uniwind.css",
      );
      expect(buildDtsFile).toHaveBeenCalledWith(
        "types.d.ts",
        expect.stringContaining("light"),
      );
      expect(stringifyThemes).toHaveBeenCalled();
    });

    it("should only run once even if beforeCompile is called multiple times", async () => {
      const { buildCSS } = await import("../../uniwind/src/css");

      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
      });

      plugin.apply(mockCompiler);

      await beforeCompileCallback();
      await beforeCompileCallback();
      await beforeCompileCallback();

      expect(buildCSS).toHaveBeenCalledTimes(1);
    });

    it("should add configInjectionLoader webpack rule", () => {
      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
      });

      plugin.apply(mockCompiler);

      const rules = mockCompiler.options.module!.rules;
      const configRule = rules.find((rule: any) =>
        rule.test?.toString().includes("config"),
      );

      expect(configRule).toBeDefined();
      expect(configRule).toMatchObject({
        test: /config\.c?js$/,
        include: /uniwind[\/\\]dist/,
        use: expect.arrayContaining([
          expect.objectContaining({
            loader: expect.stringContaining("configInjectionLoader.js"),
            options: expect.objectContaining({
              stringifiedThemes: expect.any(String),
            }),
          }),
        ]),
      });
    });

    it("should add clientDirectiveLoader webpack rule", () => {
      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
      });

      plugin.apply(mockCompiler);

      const rules = mockCompiler.options.module!.rules;
      const clientDirectiveRule = rules.find((rule: any) =>
        rule.use?.[0]?.loader?.includes("clientDirectiveLoader.js"),
      );

      expect(clientDirectiveRule).toBeDefined();
      expect(clientDirectiveRule).toMatchObject({
        test: /\.js$/,
        exclude: /index\.js$/,
        include: /uniwind[\/\\]dist[\/\\]module[\/\\]components[\/\\]web/,
      });
    });

    it("should initialize module.rules if not present", () => {
      const compilerWithoutRules = {
        hooks: {
          beforeCompile: {
            tapPromise: vi.fn(),
          },
        },
        options: {},
      } as any;

      const plugin = new UniwindWebpackPlugin({
        cssEntryFile: "uniwind.css",
      });

      plugin.apply(compilerWithoutRules);

      expect(compilerWithoutRules.options.module).toBeDefined();
      expect(compilerWithoutRules.options.module.rules).toBeInstanceOf(Array);
    });
  });
});
