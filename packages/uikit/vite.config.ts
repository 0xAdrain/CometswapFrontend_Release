import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies), "crypto"],
    },
    // 开发环境优化
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  plugins: [
    vanillaExtractPlugin({
      identifiers: "short",
    }),
    dts({
      // 开发环境跳过类型检查以加速
      skipDiagnostics: true,
    }),
  ],
  // 开发环境优化
  optimizeDeps: {
    include: ['react', 'react-dom', 'styled-components'],
  },
});
