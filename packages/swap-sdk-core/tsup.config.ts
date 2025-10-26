import { defineConfig } from 'tsup'
import { exec } from 'child_process'

export default defineConfig((options) => ({
  entry: {
    index: './src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true, // 恢复类型声明文件生成
  treeshake: true,
  splitting: true,
  clean: !options.watch,
}))
