import { build } from 'esbuild';
import { resolve, dirname } from 'node:path';

// shaders 4.0.4's JS entry eagerly registers the entire component catalog.
// Keep its original engine/API, but bundle only this composition's two definitions.
// This adapter is version-pinned and must be checked when upgrading shaders.
const selectiveCatalog = {
  name: 'sculpt-selective-shader-catalog',
  setup(builder) {
    builder.onResolve({ filter: /shaderRegistry-[^/]+\.js$/ }, args => {
      if (args.importer.includes('/node_modules/shaders/dist/core/')) {
        return { path: 'sculpt-catalog', namespace: 'sculpt-catalog' };
      }
    });
    builder.onResolve({ filter: /^\.\// }, args => {
      if (args.importer.endsWith('/shaders/dist/core/index.js') || args.importer.endsWith('/shaders/dist/core/registry.js')) {
        return { path: resolve(dirname(args.importer), args.path), sideEffects: false };
      }
    });
    builder.onLoad({ filter: /.*/, namespace: 'sculpt-catalog' }, () => ({
      contents: `
        import { componentDefinition as Marble } from 'shaders/core/Marble';
        import { componentDefinition as FilmGrain } from 'shaders/core/FilmGrain';
        const shaderRegistry = Object.fromEntries([Marble, FilmGrain].map(definition => [definition.name, {
          name: definition.name, category: definition.category, definition,
        }]));
        const getAllShaders = () => Object.values(shaderRegistry);
        const getShaderByName = name => shaderRegistry[name];
        const getShadersByCategory = category => getAllShaders().filter(s => s.category === category);
        const getShaderCategories = () => [...new Set(getAllShaders().map(s => s.category))];
        export { shaderRegistry as a, getShadersByCategory as i, getShaderByName as n, getShaderCategories as r, getAllShaders as t };
      `,
      loader: 'js', resolveDir: process.cwd(),
    }));
  },
};
await build({
  entryPoints: ['src/effects.js', 'src/phone.js'], outdir: 'assets',
  bundle: true, minify: true, format: 'iife', loader: { '.glb': 'binary', '.webp': 'dataurl' }, target: 'es2022',
  legalComments: 'linked', plugins: [selectiveCatalog], logLevel: 'info',
});
