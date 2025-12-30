import type { NextConfig } from "next";
import {withUniwind} from 'uniwind-plugin-next'

const nextConfig: NextConfig = {
    turbopack: {},
};

export default withUniwind(nextConfig, {
    cssEntryFile: './src/app/globals.css',
    extraThemes: ['ocean', 'sunset'],
});
