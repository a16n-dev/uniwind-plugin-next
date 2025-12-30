// Injects uniwind configuration into the bundle.
export default function uniwindConfigInjectionLoader(source) {
    const { stringifiedThemes } = this.query

    return `${source}\nUniwind.__reinit(() => ({}), ${stringifiedThemes});`
}
