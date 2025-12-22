import path from "path";
import fs from 'fs'

// Find the uniwind package directory within node_modules
const uniwindDir = path.dirname(require.resolve("uniwind/package.json"))

/**
 * The contents of the `css` directory is copied direct from the uniwind source code. This makes it easier to keep it in
 * sync with the upstream uniwind package, so we purposefully avoid modifying any code in `css`.
 *
 * However, we do need to patch `buildCSS()` to output the generated `uniwind.css` file into the `uniwind` package directory
 * within node_modules. To do this we temporarily patch `fs.writeFileSync` to redirect all writes of `uniwind.css` to the
 * correct location.
 *
 * Usage:
 * ```ts
 * const unpatchFs = patchFs();
 * await buildCSS(themes, cssEntryFile);
 * unpatchFs();
 */
export function patchFsForWritingUniwindCSSFile() {
    const originalWriteFileSync = fs.writeFileSync;

    fs.writeFileSync = function (_path, data, options) {
        let newPath = _path
        if(typeof newPath === 'string' && newPath.endsWith('uniwind.css')) {
            newPath =  path.join(uniwindDir, 'uniwind.css')
        }

        return originalWriteFileSync.call(fs, newPath, data, options);
    };

    return function unpatchFs() {
        fs.writeFileSync = originalWriteFileSync;
    };
}