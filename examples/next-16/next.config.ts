import type { NextConfig } from "next";
import {withUniwind} from 'uniwind-plugin-next'

const nextConfig: NextConfig = {
    turbopack: {},
};

export default withUniwind(nextConfig, {
    cssEntryFile: './app/globals.css',
    extraThemes: ['ocean', 'sunset'],
});
