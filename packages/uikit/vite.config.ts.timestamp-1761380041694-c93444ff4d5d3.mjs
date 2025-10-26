// vite.config.ts
import { defineConfig } from "file:///D:/PlanetSwap/CometFrontEnd_Realease/node_modules/.pnpm/vite@5.0.12_@types+node@22.7.5_terser@5.24.0/node_modules/vite/dist/node/index.js";
import { vanillaExtractPlugin } from "file:///D:/PlanetSwap/CometFrontEnd_Realease/node_modules/.pnpm/@vanilla-extract+vite-plugin@3.9.0_@types+node@22.7.5_terser@5.24.0_ts-node@10.9.1_@types+nod_pupuz3ohl23u5yhpnekatzkm7m/node_modules/@vanilla-extract/vite-plugin/dist/vanilla-extract-vite-plugin.cjs.js";
import dts from "file:///D:/PlanetSwap/CometFrontEnd_Realease/node_modules/.pnpm/vite-plugin-dts@3.6.3_@types+node@22.7.5_rollup@4.9.6_typescript@5.7.3_vite@5.0.12_@types+node@22.7.5_terser@5.24.0_/node_modules/vite-plugin-dts/dist/index.mjs";

// package.json
var package_default = {
  name: "@cometswap/uikit",
  version: "0.67.3",
  description: "Set of UI components for comet projects",
  type: "module",
  main: "dist/index.cjs",
  module: "dist/index.js",
  types: "dist/index.d.ts",
  sideEffects: [
    "*.css.ts",
    "src/css/**/*",
    "src/theme/**/*"
  ],
  exports: {
    "./package.json": "./package.json",
    ".": {
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    },
    "./styles": {
      import: "./dist/style.css",
      require: "./dist/style.css"
    },
    "./css/atoms": {
      import: "./src/css/atoms.ts",
      types: "./dist/css/atoms.d.ts"
    },
    "./css/vars.css": {
      import: "./src/css/vars.css.ts",
      types: "./dist/css/vars.css.d.ts"
    },
    "./css/responsiveStyle": {
      import: "./src/css/responsiveStyle.ts",
      types: "./dist/css/responsiveStyle.d.ts"
    }
  },
  repository: "https://github.com/cometswap/comet-frontend/tree/develop/packages/uikit",
  license: "MIT",
  private: true,
  scripts: {
    "build:uikit": "vite build",
    dev: "vite build --watch --mode development",
    start: "pnpm storybook",
    lint: "eslint 'src/**/*.{js,jsx,ts,tsx}'",
    "format:check": "prettier --check --loglevel error 'src/**/*.{js,jsx,ts,tsx}'",
    "format:write": "prettier --write 'src/**/*.{js,jsx,ts,tsx}'",
    storybook: "storybook dev -p 6006",
    "build:storybook": "storybook build",
    test: "vitest --run",
    "update:snapshot": "vitest -u",
    prepublishOnly: "pnpm run build:uikit",
    clean: "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  },
  devDependencies: {
    "@babel/core": "7.23.9",
    "@babel/preset-env": "^7.23.3",
    "@babel/preset-react": "^7.23.3",
    "@cometswap/chains": "workspace:*",
    "@cometswap/hooks": "workspace:*",
    "@cometswap/utils": "workspace:*",
    "@storybook/addon-a11y": "^7.0.7",
    "@storybook/addon-actions": "^7.0.7",
    "@storybook/addon-essentials": "^7.0.7",
    "@storybook/addon-links": "^7.0.7",
    "@storybook/builder-vite": "^7.0.7",
    "@storybook/react": "^7.0.7",
    "@storybook/react-vite": "^7.0.7",
    "@testing-library/jest-dom": "^5.11.6",
    "@testing-library/react": "^12.1.3",
    "@types/d3": "^7.4.0",
    "@types/js-cookie": "^3.0.2",
    "@types/lodash": "^4.14.168",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.0.6",
    "@types/react-router-dom": "^5.1.7",
    "@types/react-transition-group": "^4.4.1",
    "@types/styled-system__should-forward-prop": "^5.1.2",
    "@vanilla-extract/vite-plugin": "^3.8.0",
    "@vitejs/plugin-react": "4.2.1",
    "babel-loader": "^9.1.2",
    "babel-plugin-styled-components": "^1.12.0",
    d3: "^7.8.2",
    "happy-dom": "^13.3.8",
    "jest-styled-components": "^7.0.8",
    "js-cookie": "*",
    "next-themes": "^0.2.1",
    polished: "^4.2.2",
    react: "^18.2.0",
    "react-countup": "^6.4.0",
    "react-device-detect": "*",
    "react-dom": "^18.2.0",
    "react-is": "^17.0.2",
    "react-markdown": "^6.0.2",
    "react-redux": "^8.0.5",
    "react-router-dom": "^5.2.0",
    "react-transition-group": "*",
    "remark-gfm": "*",
    "rollup-plugin-node-builtins": "^2.1.2",
    storybook: "^7.0.7",
    "styled-components": "6.0.7",
    vite: "5.0.12",
    "vite-plugin-dts": "^3.5.3",
    "vite-tsconfig-paths": "^4.0.3"
  },
  peerDependencies: {
    "js-cookie": "*",
    "next-themes": "^0.2.1",
    react: "^18.2.0",
    "react-device-detect": "*",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-transition-group": "*",
    "remark-gfm": "*",
    "styled-components": "6.0.7"
  },
  dependencies: {
    "@cometswap/hooks": "workspace:*",
    "@cometswap/localization": "workspace:*",
    "@popperjs/core": "^2.9.2",
    "@radix-ui/react-dismissable-layer": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.0",
    "@styled-system/should-forward-prop": "^5.1.5",
    "@types/styled-system": "^5.1.17",
    "@vanilla-extract/css": "^1.13.0",
    "@vanilla-extract/css-utils": "^0.1.3",
    "@vanilla-extract/recipes": "^0.5.0",
    "@vanilla-extract/sprinkles": "^1.6.1",
    "bignumber.js": "^9.0.0",
    clsx: "^1.2.1",
    csstype: "^3.1.2",
    dayjs: "^1.11.10",
    deepmerge: "^4.0.0",
    "framer-motion": "10.16.4",
    "lightweight-charts": "^4.0.1",
    lodash: "^4.17.20",
    primereact: "^10.6.6",
    "react-popper": "^2.3.0",
    sonner: "^1.2.4",
    "styled-system": "^5.1.5",
    tslib: "^2.2.0"
  },
  publishConfig: {
    access: "public"
  }
};

// vite.config.ts
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["cjs", "es"]
    },
    rollupOptions: {
      external: [...Object.keys(package_default.peerDependencies), ...Object.keys(package_default.dependencies), "crypto"]
    },
    // 开发环境优化
    minify: process.env.NODE_ENV === "production" ? "esbuild" : false,
    sourcemap: process.env.NODE_ENV !== "production"
  },
  plugins: [
    vanillaExtractPlugin({
      identifiers: "short"
    }),
    dts({
      // 开发环境跳过类型检查以加速
      skipDiagnostics: process.env.NODE_ENV !== "production"
    })
  ],
  // 开发环境优化
  optimizeDeps: {
    include: ["react", "react-dom", "styled-components"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcUGxhbmV0U3dhcFxcXFxDb21ldEZyb250RW5kX1JlYWxlYXNlXFxcXHBhY2thZ2VzXFxcXHVpa2l0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQbGFuZXRTd2FwXFxcXENvbWV0RnJvbnRFbmRfUmVhbGVhc2VcXFxccGFja2FnZXNcXFxcdWlraXRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1BsYW5ldFN3YXAvQ29tZXRGcm9udEVuZF9SZWFsZWFzZS9wYWNrYWdlcy91aWtpdC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyB2YW5pbGxhRXh0cmFjdFBsdWdpbiB9IGZyb20gXCJAdmFuaWxsYS1leHRyYWN0L3ZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcblxuaW1wb3J0IHBrZyBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBcInNyYy9pbmRleC50c1wiLFxuICAgICAgZmlsZU5hbWU6IFwiaW5kZXhcIixcbiAgICAgIGZvcm1hdHM6IFtcImNqc1wiLCBcImVzXCJdLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsuLi5PYmplY3Qua2V5cyhwa2cucGVlckRlcGVuZGVuY2llcyksIC4uLk9iamVjdC5rZXlzKHBrZy5kZXBlbmRlbmNpZXMpLCBcImNyeXB0b1wiXSxcbiAgICB9LFxuICAgIC8vIFx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NEYxOFx1NTMxNlxuICAgIG1pbmlmeTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/ICdlc2J1aWxkJyA6IGZhbHNlLFxuICAgIHNvdXJjZW1hcDogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHZhbmlsbGFFeHRyYWN0UGx1Z2luKHtcbiAgICAgIGlkZW50aWZpZXJzOiBcInNob3J0XCIsXG4gICAgfSksXG4gICAgZHRzKHtcbiAgICAgIC8vIFx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1OERGM1x1OEZDN1x1N0M3Qlx1NTc4Qlx1NjhDMFx1NjdFNVx1NEVFNVx1NTJBMFx1OTAxRlxuICAgICAgc2tpcERpYWdub3N0aWNzOiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nLFxuICAgIH0pLFxuICBdLFxuICAvLyBcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRGMThcdTUzMTZcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAnc3R5bGVkLWNvbXBvbmVudHMnXSxcbiAgfSxcbn0pO1xuIiwgIntcclxuICBcIm5hbWVcIjogXCJAY29tZXRzd2FwL3Vpa2l0XCIsXHJcbiAgXCJ2ZXJzaW9uXCI6IFwiMC42Ny4zXCIsXHJcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlNldCBvZiBVSSBjb21wb25lbnRzIGZvciBjb21ldCBwcm9qZWN0c1wiLFxyXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxyXG4gIFwibWFpblwiOiBcImRpc3QvaW5kZXguY2pzXCIsXHJcbiAgXCJtb2R1bGVcIjogXCJkaXN0L2luZGV4LmpzXCIsXHJcbiAgXCJ0eXBlc1wiOiBcImRpc3QvaW5kZXguZC50c1wiLFxyXG4gIFwic2lkZUVmZmVjdHNcIjogW1xyXG4gICAgXCIqLmNzcy50c1wiLFxyXG4gICAgXCJzcmMvY3NzLyoqLypcIixcclxuICAgIFwic3JjL3RoZW1lLyoqLypcIlxyXG4gIF0sXHJcbiAgXCJleHBvcnRzXCI6IHtcclxuICAgIFwiLi9wYWNrYWdlLmpzb25cIjogXCIuL3BhY2thZ2UuanNvblwiLFxyXG4gICAgXCIuXCI6IHtcclxuICAgICAgXCJpbXBvcnRcIjogXCIuL2Rpc3QvaW5kZXguanNcIixcclxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L2luZGV4LmNqc1wiXHJcbiAgICB9LFxyXG4gICAgXCIuL3N0eWxlc1wiOiB7XHJcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L3N0eWxlLmNzc1wiLFxyXG4gICAgICBcInJlcXVpcmVcIjogXCIuL2Rpc3Qvc3R5bGUuY3NzXCJcclxuICAgIH0sXHJcbiAgICBcIi4vY3NzL2F0b21zXCI6IHtcclxuICAgICAgXCJpbXBvcnRcIjogXCIuL3NyYy9jc3MvYXRvbXMudHNcIixcclxuICAgICAgXCJ0eXBlc1wiOiBcIi4vZGlzdC9jc3MvYXRvbXMuZC50c1wiXHJcbiAgICB9LFxyXG4gICAgXCIuL2Nzcy92YXJzLmNzc1wiOiB7XHJcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9zcmMvY3NzL3ZhcnMuY3NzLnRzXCIsXHJcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvY3NzL3ZhcnMuY3NzLmQudHNcIlxyXG4gICAgfSxcclxuICAgIFwiLi9jc3MvcmVzcG9uc2l2ZVN0eWxlXCI6IHtcclxuICAgICAgXCJpbXBvcnRcIjogXCIuL3NyYy9jc3MvcmVzcG9uc2l2ZVN0eWxlLnRzXCIsXHJcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvY3NzL3Jlc3BvbnNpdmVTdHlsZS5kLnRzXCJcclxuICAgIH1cclxuICB9LFxyXG4gIFwicmVwb3NpdG9yeVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9jb21ldHN3YXAvY29tZXQtZnJvbnRlbmQvdHJlZS9kZXZlbG9wL3BhY2thZ2VzL3Vpa2l0XCIsXHJcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXHJcbiAgXCJwcml2YXRlXCI6IHRydWUsXHJcbiAgXCJzY3JpcHRzXCI6IHtcclxuICAgIFwiYnVpbGQ6dWlraXRcIjogXCJ2aXRlIGJ1aWxkXCIsXHJcbiAgICBcImRldlwiOiBcInZpdGUgYnVpbGQgLS13YXRjaCAtLW1vZGUgZGV2ZWxvcG1lbnRcIixcclxuICAgIFwic3RhcnRcIjogXCJwbnBtIHN0b3J5Ym9va1wiLFxyXG4gICAgXCJsaW50XCI6IFwiZXNsaW50ICdzcmMvKiovKi57anMsanN4LHRzLHRzeH0nXCIsXHJcbiAgICBcImZvcm1hdDpjaGVja1wiOiBcInByZXR0aWVyIC0tY2hlY2sgLS1sb2dsZXZlbCBlcnJvciAnc3JjLyoqLyoue2pzLGpzeCx0cyx0c3h9J1wiLFxyXG4gICAgXCJmb3JtYXQ6d3JpdGVcIjogXCJwcmV0dGllciAtLXdyaXRlICdzcmMvKiovKi57anMsanN4LHRzLHRzeH0nXCIsXHJcbiAgICBcInN0b3J5Ym9va1wiOiBcInN0b3J5Ym9vayBkZXYgLXAgNjAwNlwiLFxyXG4gICAgXCJidWlsZDpzdG9yeWJvb2tcIjogXCJzdG9yeWJvb2sgYnVpbGRcIixcclxuICAgIFwidGVzdFwiOiBcInZpdGVzdCAtLXJ1blwiLFxyXG4gICAgXCJ1cGRhdGU6c25hcHNob3RcIjogXCJ2aXRlc3QgLXVcIixcclxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJwbnBtIHJ1biBidWlsZDp1aWtpdFwiLFxyXG4gICAgXCJjbGVhblwiOiBcInJtIC1yZiAudHVyYm8gJiYgcm0gLXJmIG5vZGVfbW9kdWxlcyAmJiBybSAtcmYgZGlzdFwiXHJcbiAgfSxcclxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBiYWJlbC9jb3JlXCI6IFwiNy4yMy45XCIsXHJcbiAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCI6IFwiXjcuMjMuM1wiLFxyXG4gICAgXCJAYmFiZWwvcHJlc2V0LXJlYWN0XCI6IFwiXjcuMjMuM1wiLFxyXG4gICAgXCJAY29tZXRzd2FwL2NoYWluc1wiOiBcIndvcmtzcGFjZToqXCIsXHJcbiAgICBcIkBjb21ldHN3YXAvaG9va3NcIjogXCJ3b3Jrc3BhY2U6KlwiLFxyXG4gICAgXCJAY29tZXRzd2FwL3V0aWxzXCI6IFwid29ya3NwYWNlOipcIixcclxuICAgIFwiQHN0b3J5Ym9vay9hZGRvbi1hMTF5XCI6IFwiXjcuMC43XCIsXHJcbiAgICBcIkBzdG9yeWJvb2svYWRkb24tYWN0aW9uc1wiOiBcIl43LjAuN1wiLFxyXG4gICAgXCJAc3Rvcnlib29rL2FkZG9uLWVzc2VudGlhbHNcIjogXCJeNy4wLjdcIixcclxuICAgIFwiQHN0b3J5Ym9vay9hZGRvbi1saW5rc1wiOiBcIl43LjAuN1wiLFxyXG4gICAgXCJAc3Rvcnlib29rL2J1aWxkZXItdml0ZVwiOiBcIl43LjAuN1wiLFxyXG4gICAgXCJAc3Rvcnlib29rL3JlYWN0XCI6IFwiXjcuMC43XCIsXHJcbiAgICBcIkBzdG9yeWJvb2svcmVhY3Qtdml0ZVwiOiBcIl43LjAuN1wiLFxyXG4gICAgXCJAdGVzdGluZy1saWJyYXJ5L2plc3QtZG9tXCI6IFwiXjUuMTEuNlwiLFxyXG4gICAgXCJAdGVzdGluZy1saWJyYXJ5L3JlYWN0XCI6IFwiXjEyLjEuM1wiLFxyXG4gICAgXCJAdHlwZXMvZDNcIjogXCJeNy40LjBcIixcclxuICAgIFwiQHR5cGVzL2pzLWNvb2tpZVwiOiBcIl4zLjAuMlwiLFxyXG4gICAgXCJAdHlwZXMvbG9kYXNoXCI6IFwiXjQuMTQuMTY4XCIsXHJcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4yLjIxXCIsXHJcbiAgICBcIkB0eXBlcy9yZWFjdC1kb21cIjogXCJeMTguMC42XCIsXHJcbiAgICBcIkB0eXBlcy9yZWFjdC1yb3V0ZXItZG9tXCI6IFwiXjUuMS43XCIsXHJcbiAgICBcIkB0eXBlcy9yZWFjdC10cmFuc2l0aW9uLWdyb3VwXCI6IFwiXjQuNC4xXCIsXHJcbiAgICBcIkB0eXBlcy9zdHlsZWQtc3lzdGVtX19zaG91bGQtZm9yd2FyZC1wcm9wXCI6IFwiXjUuMS4yXCIsXHJcbiAgICBcIkB2YW5pbGxhLWV4dHJhY3Qvdml0ZS1wbHVnaW5cIjogXCJeMy44LjBcIixcclxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCI0LjIuMVwiLFxyXG4gICAgXCJiYWJlbC1sb2FkZXJcIjogXCJeOS4xLjJcIixcclxuICAgIFwiYmFiZWwtcGx1Z2luLXN0eWxlZC1jb21wb25lbnRzXCI6IFwiXjEuMTIuMFwiLFxyXG4gICAgXCJkM1wiOiBcIl43LjguMlwiLFxyXG4gICAgXCJoYXBweS1kb21cIjogXCJeMTMuMy44XCIsXHJcbiAgICBcImplc3Qtc3R5bGVkLWNvbXBvbmVudHNcIjogXCJeNy4wLjhcIixcclxuICAgIFwianMtY29va2llXCI6IFwiKlwiLFxyXG4gICAgXCJuZXh0LXRoZW1lc1wiOiBcIl4wLjIuMVwiLFxyXG4gICAgXCJwb2xpc2hlZFwiOiBcIl40LjIuMlwiLFxyXG4gICAgXCJyZWFjdFwiOiBcIl4xOC4yLjBcIixcclxuICAgIFwicmVhY3QtY291bnR1cFwiOiBcIl42LjQuMFwiLFxyXG4gICAgXCJyZWFjdC1kZXZpY2UtZGV0ZWN0XCI6IFwiKlwiLFxyXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTguMi4wXCIsXHJcbiAgICBcInJlYWN0LWlzXCI6IFwiXjE3LjAuMlwiLFxyXG4gICAgXCJyZWFjdC1tYXJrZG93blwiOiBcIl42LjAuMlwiLFxyXG4gICAgXCJyZWFjdC1yZWR1eFwiOiBcIl44LjAuNVwiLFxyXG4gICAgXCJyZWFjdC1yb3V0ZXItZG9tXCI6IFwiXjUuMi4wXCIsXHJcbiAgICBcInJlYWN0LXRyYW5zaXRpb24tZ3JvdXBcIjogXCIqXCIsXHJcbiAgICBcInJlbWFyay1nZm1cIjogXCIqXCIsXHJcbiAgICBcInJvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGluc1wiOiBcIl4yLjEuMlwiLFxyXG4gICAgXCJzdG9yeWJvb2tcIjogXCJeNy4wLjdcIixcclxuICAgIFwic3R5bGVkLWNvbXBvbmVudHNcIjogXCI2LjAuN1wiLFxyXG4gICAgXCJ2aXRlXCI6IFwiNS4wLjEyXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWR0c1wiOiBcIl4zLjUuM1wiLFxyXG4gICAgXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI6IFwiXjQuMC4zXCJcclxuICB9LFxyXG4gIFwicGVlckRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcImpzLWNvb2tpZVwiOiBcIipcIixcclxuICAgIFwibmV4dC10aGVtZXNcIjogXCJeMC4yLjFcIixcclxuICAgIFwicmVhY3RcIjogXCJeMTguMi4wXCIsXHJcbiAgICBcInJlYWN0LWRldmljZS1kZXRlY3RcIjogXCIqXCIsXHJcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcclxuICAgIFwicmVhY3QtcmVkdXhcIjogXCJeOC4wLjVcIixcclxuICAgIFwicmVhY3QtdHJhbnNpdGlvbi1ncm91cFwiOiBcIipcIixcclxuICAgIFwicmVtYXJrLWdmbVwiOiBcIipcIixcclxuICAgIFwic3R5bGVkLWNvbXBvbmVudHNcIjogXCI2LjAuN1wiXHJcbiAgfSxcclxuICBcImRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBjb21ldHN3YXAvaG9va3NcIjogXCJ3b3Jrc3BhY2U6KlwiLFxyXG4gICAgXCJAY29tZXRzd2FwL2xvY2FsaXphdGlvblwiOiBcIndvcmtzcGFjZToqXCIsXHJcbiAgICBcIkBwb3BwZXJqcy9jb3JlXCI6IFwiXjIuOS4yXCIsXHJcbiAgICBcIkByYWRpeC11aS9yZWFjdC1kaXNtaXNzYWJsZS1sYXllclwiOiBcIl4xLjAuM1wiLFxyXG4gICAgXCJAcmFkaXgtdWkvcmVhY3Qtc2xvdFwiOiBcIl4xLjAuMFwiLFxyXG4gICAgXCJAc3R5bGVkLXN5c3RlbS9zaG91bGQtZm9yd2FyZC1wcm9wXCI6IFwiXjUuMS41XCIsXHJcbiAgICBcIkB0eXBlcy9zdHlsZWQtc3lzdGVtXCI6IFwiXjUuMS4xN1wiLFxyXG4gICAgXCJAdmFuaWxsYS1leHRyYWN0L2Nzc1wiOiBcIl4xLjEzLjBcIixcclxuICAgIFwiQHZhbmlsbGEtZXh0cmFjdC9jc3MtdXRpbHNcIjogXCJeMC4xLjNcIixcclxuICAgIFwiQHZhbmlsbGEtZXh0cmFjdC9yZWNpcGVzXCI6IFwiXjAuNS4wXCIsXHJcbiAgICBcIkB2YW5pbGxhLWV4dHJhY3Qvc3ByaW5rbGVzXCI6IFwiXjEuNi4xXCIsXHJcbiAgICBcImJpZ251bWJlci5qc1wiOiBcIl45LjAuMFwiLFxyXG4gICAgXCJjbHN4XCI6IFwiXjEuMi4xXCIsXHJcbiAgICBcImNzc3R5cGVcIjogXCJeMy4xLjJcIixcclxuICAgIFwiZGF5anNcIjogXCJeMS4xMS4xMFwiLFxyXG4gICAgXCJkZWVwbWVyZ2VcIjogXCJeNC4wLjBcIixcclxuICAgIFwiZnJhbWVyLW1vdGlvblwiOiBcIjEwLjE2LjRcIixcclxuICAgIFwibGlnaHR3ZWlnaHQtY2hhcnRzXCI6IFwiXjQuMC4xXCIsXHJcbiAgICBcImxvZGFzaFwiOiBcIl40LjE3LjIwXCIsXHJcbiAgICBcInByaW1lcmVhY3RcIjogXCJeMTAuNi42XCIsXHJcbiAgICBcInJlYWN0LXBvcHBlclwiOiBcIl4yLjMuMFwiLFxyXG4gICAgXCJzb25uZXJcIjogXCJeMS4yLjRcIixcclxuICAgIFwic3R5bGVkLXN5c3RlbVwiOiBcIl41LjEuNVwiLFxyXG4gICAgXCJ0c2xpYlwiOiBcIl4yLjIuMFwiXHJcbiAgfSxcclxuICBcInB1Ymxpc2hDb25maWdcIjoge1xyXG4gICAgXCJhY2Nlc3NcIjogXCJwdWJsaWNcIlxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFWLFNBQVMsb0JBQW9CO0FBQ2xYLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sU0FBUzs7O0FDRmhCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixNQUFRO0FBQUEsRUFDUixNQUFRO0FBQUEsRUFDUixRQUFVO0FBQUEsRUFDVixPQUFTO0FBQUEsRUFDVCxhQUFlO0FBQUEsSUFD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
