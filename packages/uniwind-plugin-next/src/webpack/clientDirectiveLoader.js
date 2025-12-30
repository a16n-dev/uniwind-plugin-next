export default function clientDirectiveLoader(source) {
    // Don't add the directive if it's already present
    if (source.startsWith('"use client"') || source.startsWith("'use client'")) {
        return source;
    }

    return `"use client";\n${source}`;
}
