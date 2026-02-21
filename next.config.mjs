import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsdomStub = path.resolve(__dirname, 'src/lib/stubs/jsdom.js');
const jsdomLivingUtilsStub = path.resolve(__dirname, 'src/lib/stubs/jsdom-living-generated-utils.js');
const jsdomUtilsStub = path.resolve(__dirname, 'src/lib/stubs/jsdom-utils.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        port: '',
      },
    ],
  },
  webpack: (config, { webpack }) => {
    // Stub jsdom and subpaths so fabric.js (browser build) can be bundled.
    // Fabric requires these only in Node when document/window are missing;
    // in the browser that branch is never run.
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^jsdom$/, jsdomStub),
      new webpack.NormalModuleReplacementPlugin(/^jsdom\/lib\/jsdom\/living\/generated\/utils$/, jsdomLivingUtilsStub),
      new webpack.NormalModuleReplacementPlugin(/^jsdom\/lib\/jsdom\/utils$/, jsdomUtilsStub),
    );
    return config;
  },
};

export default nextConfig;
