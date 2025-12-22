import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/postcss/index.ts', 'src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  exports: true,
  copy: [
    { from: 'src/webpack/configInjectionLoader.js', to: 'dist' },
  ]
});
