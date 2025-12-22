module.exports = ()=> {
    return {
        postcssPlugin: 'uniwind-plugin-next',
        Once(root: any) {
            root.walkDecls((decl: any) => {
                // Transform pixelRatio(X) → calc(X * 1px)
                decl.value = decl.value.replace(
                    /pixelRatio\(([^)]+)\)/g,
                    'calc($1 * 1px)'
                )
                // Transform fontScale(X) → calc(X * 1rem)
                decl.value = decl.value.replace(
                    /fontScale\(([^)]+)\)/g,
                    'calc($1 * 1rem)'
                )
                // Transform hairlineWidth() → 1px
                decl.value = decl.value.replace(
                    /hairlineWidth\(\)/g,
                    '1px'
                )
            })
        }
    }
}

module.exports.postcss = true;
