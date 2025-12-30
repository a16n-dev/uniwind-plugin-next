import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/postcss/index.ts', 'src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  exports: {
    customExports(pkg, context) {
      if(!pkg['.']) pkg['.'] = {}
      pkg['.'].style = "./dist/uniwind.css"
      return pkg
    },
  },
  copy: [
    { from: 'src/webpack/configInjectionLoader.js', to: 'dist' },
    { from: 'src/webpack/clientDirectiveLoader.js', to: 'dist' },
  ]
});
