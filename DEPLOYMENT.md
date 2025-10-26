# CometSwap 前端部署指南

## 🚀 Vercel 部署

### 前提条件
- ✅ 项目已成功构建（`pnpm run build`）
- ✅ 已配置 `vercel.json` 文件
- ✅ 所有 TypeScript 错误已修复
- ✅ 所有构建错误已解决

### 部署步骤

#### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```

#### 3. 部署项目
```bash
# 在项目根目录运行
vercel

# 或者直接部署到生产环境
vercel --prod
```

### 环境变量配置

在 Vercel 控制台中配置以下环境变量：

#### 必需的环境变量
```
NODE_ENV=production
NEXT_PUBLIC_VERCEL_ENV=production
SKIP_ENV_VALIDATION=true
```

#### 可选的环境变量
```
NEXT_PUBLIC_ASSET_CDN=https://assets.cometswap.finance
NEXT_PUBLIC_SNAPSHOT_BASE_URL=https://hub.snapshot.org
NEXT_PUBLIC_NODE_REAL_API_INFO=your_nodereal_api_key
NEXT_PUBLIC_NODE_REAL_API_ETH=your_nodereal_api_key
```

### 构建配置

项目使用以下构建配置：

- **Framework**: Next.js
- **Build Command**: `pnpm run build`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install --frozen-lockfile`

### Subgraph 依赖

项目包含 subgraph 配置，但在没有 subgraph 的情况下仍可运行：

- V2/V3 subgraph 端点已配置
- 包含 subgraph 健康检查
- 支持链上数据回退

### 性能优化

已实施的优化：

1. **TurboRepo 缓存**: 启用构建缓存
2. **Next.js 实验性功能**: Turbo 模式
3. **Vite 优化**: 开发环境跳过压缩
4. **依赖优化**: 预构建常用依赖

### 部署后验证

部署完成后，验证以下功能：

1. ✅ 首页加载正常
2. ✅ 移动端"更多"按钮功能正常
3. ✅ 网络切换器工作
4. ✅ 语言选择器工作
5. ✅ 全局设置功能正常
6. ✅ 交换功能可用

### 故障排除

#### 常见问题

1. **构建失败**
   - 检查 TypeScript 错误
   - 确保所有依赖已安装
   - 验证环境变量配置

2. **运行时错误**
   - 检查浏览器控制台
   - 验证 API 端点可访问性
   - 确认 subgraph 端点状态

3. **性能问题**
   - 启用 CDN
   - 检查图片优化
   - 验证缓存配置

#### 调试命令

```bash
# 本地生产构建测试
NODE_ENV=production pnpm run build
pnpm run start

# 检查构建输出
ls -la apps/web/.next/

# 验证依赖
pnpm list --depth=0
```

### 监控和维护

- 使用 Vercel Analytics 监控性能
- 设置错误追踪（Sentry）
- 定期更新依赖
- 监控 subgraph 健康状态

## 📝 注意事项

1. **COMET相关功能已移除**: 价格显示和购买按钮已禁用
2. **移动端优化**: 新的"更多"按钮设计已实现
3. **UI 现代化**: 减少圆角，增加专业感
4. **响应式设计**: 支持各种屏幕尺寸

## 🔗 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [TurboRepo 文档](https://turbo.build/repo/docs)

## 🚀 Vercel 部署

### 前提条件
- ✅ 项目已成功构建（`pnpm run build`）
- ✅ 已配置 `vercel.json` 文件
- ✅ 所有 TypeScript 错误已修复
- ✅ 所有构建错误已解决

### 部署步骤

#### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```

#### 3. 部署项目
```bash
# 在项目根目录运行
vercel

# 或者直接部署到生产环境
vercel --prod
```

### 环境变量配置

在 Vercel 控制台中配置以下环境变量：

#### 必需的环境变量
```
NODE_ENV=production
NEXT_PUBLIC_VERCEL_ENV=production
SKIP_ENV_VALIDATION=true
```

#### 可选的环境变量
```
NEXT_PUBLIC_ASSET_CDN=https://assets.cometswap.finance
NEXT_PUBLIC_SNAPSHOT_BASE_URL=https://hub.snapshot.org
NEXT_PUBLIC_NODE_REAL_API_INFO=your_nodereal_api_key
NEXT_PUBLIC_NODE_REAL_API_ETH=your_nodereal_api_key
```

### 构建配置

项目使用以下构建配置：

- **Framework**: Next.js
- **Build Command**: `pnpm run build`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install --frozen-lockfile`

### Subgraph 依赖

项目包含 subgraph 配置，但在没有 subgraph 的情况下仍可运行：

- V2/V3 subgraph 端点已配置
- 包含 subgraph 健康检查
- 支持链上数据回退

### 性能优化

已实施的优化：

1. **TurboRepo 缓存**: 启用构建缓存
2. **Next.js 实验性功能**: Turbo 模式
3. **Vite 优化**: 开发环境跳过压缩
4. **依赖优化**: 预构建常用依赖

### 部署后验证

部署完成后，验证以下功能：

1. ✅ 首页加载正常
2. ✅ 移动端"更多"按钮功能正常
3. ✅ 网络切换器工作
4. ✅ 语言选择器工作
5. ✅ 全局设置功能正常
6. ✅ 交换功能可用

### 故障排除

#### 常见问题

1. **构建失败**
   - 检查 TypeScript 错误
   - 确保所有依赖已安装
   - 验证环境变量配置

2. **运行时错误**
   - 检查浏览器控制台
   - 验证 API 端点可访问性
   - 确认 subgraph 端点状态

3. **性能问题**
   - 启用 CDN
   - 检查图片优化
   - 验证缓存配置

#### 调试命令

```bash
# 本地生产构建测试
NODE_ENV=production pnpm run build
pnpm run start

# 检查构建输出
ls -la apps/web/.next/

# 验证依赖
pnpm list --depth=0
```

### 监控和维护

- 使用 Vercel Analytics 监控性能
- 设置错误追踪（Sentry）
- 定期更新依赖
- 监控 subgraph 健康状态

## 📝 注意事项

1. **COMET相关功能已移除**: 价格显示和购买按钮已禁用
2. **移动端优化**: 新的"更多"按钮设计已实现
3. **UI 现代化**: 减少圆角，增加专业感
4. **响应式设计**: 支持各种屏幕尺寸

## 🔗 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [TurboRepo 文档](https://turbo.build/repo/docs)


