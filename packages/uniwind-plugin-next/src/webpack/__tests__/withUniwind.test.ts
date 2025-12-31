import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withUniwind } from '../withUniwind';
import { UniwindWebpackPlugin } from '../UniwindWebpackPlugin';
import type { Configuration } from 'webpack';

vi.mock('../UniwindWebpackPlugin', () => ({
  UniwindWebpackPlugin: vi.fn().mockImplementation(function() {
    return { apply: vi.fn() };
  }),
}));

describe('withUniwind', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('config merging', () => {
    it('should return a valid Next.js config', () => {
      const result = withUniwind({}, {
        cssEntryFile: 'uniwind.css',
      });

      expect(result).toBeDefined();
      expect(result.webpack).toBeInstanceOf(Function);
      expect(result.transpilePackages).toBeInstanceOf(Array);
    });

    it('should merge transpilePackages with existing config', () => {
      const nextConfig = {
        transpilePackages: ['some-other-package'],
      };

      const result = withUniwind(nextConfig, {
        cssEntryFile: 'uniwind.css',
      });

      expect(result.transpilePackages).toContain('some-other-package');
      expect(result.transpilePackages).toContain('uniwind');
      expect(result.transpilePackages).toContain('react-native');
      expect(result.transpilePackages).toContain('react-native-web');
    });

    it('should add uniwind packages to transpilePackages when none exist', () => {
      const result = withUniwind({}, {
        cssEntryFile: 'uniwind.css',
      });

      expect(result.transpilePackages).toEqual(
        expect.arrayContaining(['uniwind', 'react-native', 'react-native-web'])
      );
    });

    it('should deduplicate transpilePackages', () => {
      const nextConfig = {
        transpilePackages: ['uniwind', 'react-native'],
      };

      const result = withUniwind(nextConfig, {
        cssEntryFile: 'uniwind.css',
      });

      const uniwindCount = result.transpilePackages.filter((p: string) => p === 'uniwind').length;
      expect(uniwindCount).toBe(1);
    });

    it('should preserve other Next.js config properties', () => {
      const nextConfig = {
        reactStrictMode: true,
        images: {
          domains: ['example.com'],
        },
        env: {
          CUSTOM_VAR: 'value',
        },
      };

      const result = withUniwind(nextConfig, {
        cssEntryFile: 'uniwind.css',
      });

      expect(result.reactStrictMode).toBe(true);
      expect(result.images).toEqual({ domains: ['example.com'] });
      expect(result.env).toEqual({ CUSTOM_VAR: 'value' });
    });
  });

  describe('webpack function', () => {
    it('should add UniwindWebpackPlugin to plugins', () => {
      const result = withUniwind({}, {
        cssEntryFile: 'uniwind.css',
      });

      const webpackConfig: Configuration = { plugins: [] };
      const options = {};

      const newConfig = result.webpack(webpackConfig, options);

      expect(UniwindWebpackPlugin).toHaveBeenCalledWith({
        cssEntryFile: 'uniwind.css',
      });
      expect(newConfig.plugins).toHaveLength(2); // NormalModuleReplacementPlugin + UniwindWebpackPlugin
    });

    it('should initialize plugins array if not present', () => {
      const result = withUniwind({}, {
        cssEntryFile: 'uniwind.css',
      });

      const webpackConfig: Configuration = {};
      const options = {};

      const newConfig = result.webpack(webpackConfig, options);

      expect(newConfig.plugins).toBeDefined();
      expect(newConfig.plugins).toBeInstanceOf(Array);
    });

    it('should add NormalModuleReplacementPlugin for react-native', () => {
      const result = withUniwind({}, {
        cssEntryFile: 'uniwind.css',
      });

      const webpackConfig: Configuration = { plugins: [] };
      const options = {};

      const newConfig = result.webpack(webpackConfig, options);

      const replacementPlugin = newConfig.plugins?.find(
        (plugin: any) => plugin?.constructor?.name === 'NormalModuleReplacementPlugin'
      );

      expect(replacementPlugin).toBeDefined();
    });

    it('should call user-defined webpack function if present', () => {
      const userWebpackFn = vi.fn((config) => ({ ...config, custom: true }));
      const nextConfig = {
        webpack: userWebpackFn,
      };

      const result = withUniwind(nextConfig, {
        cssEntryFile: 'uniwind.css',
      });

      const webpackConfig: Configuration = { plugins: [] };
      const options = { dev: true };

      const newConfig = result.webpack(webpackConfig, options);

      expect(userWebpackFn).toHaveBeenCalledWith(
        expect.objectContaining({ plugins: expect.any(Array) }),
        options
      );
      expect(newConfig.custom).toBe(true);
    });

    it('should return config directly if no user webpack function', () => {
      const result = withUniwind({}, {
        cssEntryFile: 'uniwind.css',
      });

      const webpackConfig: Configuration = { plugins: [] };
      const options = {};

      const newConfig = result.webpack(webpackConfig, options);

      expect(newConfig).toBeDefined();
      expect(newConfig.plugins).toBeDefined();
    });
  });

  describe('react-native module replacement', () => {
    it('should configure replacement for react-native imports', () => {
      const result = withUniwind({}, {
        cssEntryFile: 'uniwind.css',
      });

      const webpackConfig: Configuration = { plugins: [] };
      const options = {};

      const newConfig = result.webpack(webpackConfig, options);

      const replacementPlugin = newConfig.plugins?.find(
        (plugin: any) => plugin?.constructor?.name === 'NormalModuleReplacementPlugin'
      );

      expect(replacementPlugin).toBeDefined();
    });

    it('should handle resource replacement logic correctly', () => {
      const result = withUniwind({}, {
        cssEntryFile: 'uniwind.css',
      });

      const webpackConfig: Configuration = { plugins: [] };
      const options = {};

      const newConfig = result.webpack(webpackConfig, options);

      const replacementPlugin: any = newConfig.plugins?.find(
        (plugin: any) => plugin?.constructor?.name === 'NormalModuleReplacementPlugin'
      );

      // Test resource replacement for uniwind components
      const uniwindResource = {
        context: '/path/to/uniwind/dist/module/components/web',
        request: 'react-native',
      };
      replacementPlugin.newResource(uniwindResource);
      expect(uniwindResource.request).toBe('react-native-web');

      // Test resource replacement for user code
      const userResource = {
        context: '/path/to/user/code',
        request: 'react-native',
      };
      replacementPlugin.newResource(userResource);
      expect(userResource.request).toBe('uniwind/components/index');

      // Test with undefined context
      const noContextResource = {
        context: undefined,
        request: 'react-native',
      };
      replacementPlugin.newResource(noContextResource);
      expect(noContextResource.request).toBe('uniwind/components/index');
    });
  });

  describe('uniwind config passing', () => {
    it('should pass uniwind config to plugin with all options', () => {
      const uniwindConfig = {
        cssEntryFile: 'custom.css',
        extraThemes: ['brand', 'dark-mode'],
        dtsFile: 'custom-types.d.ts',
      };

      const result = withUniwind({}, uniwindConfig);

      const webpackConfig: Configuration = { plugins: [] };
      const options = {};

      result.webpack(webpackConfig, options);

      expect(UniwindWebpackPlugin).toHaveBeenCalledWith(uniwindConfig);
    });
  });
});
