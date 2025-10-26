import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'connectors/blocto': 'connectors/blocto/index.ts',
    'connectors/trustWallet': 'connectors/trustWallet/index.ts',
  },
  treeshake: true,
  splitting: true,
  format: ['esm', 'cjs'],
  dts: false, // 暂时跳过类型声明文件生成，因为 wagmi 是 peerDependency
})
