# COMET ve 机制前端重构计划

## 📋 项目概述

本文档详细规划了 CometSwap 前端 ve 机制的重构计划，目标是删除 PancakeSwap 历史遗留的冗余代码，简化架构，同时保持现有 UI 的完整兼容性。

## 🎯 重构目标

### 核心原则
- ✅ 保持 COMET + veCOMET 双代币机制
- ✅ 保留代币质押功能（COMET 质押获得 veCOMET）
- ✅ 支持用户自定义锁定时间（1天-4年任意选择）
- ❌ 删除所有迁移相关代码和历史包袱（包括 COMET 本币的迁移逻辑）
- ❌ 删除所有跨链相关代码（只支持 EVM）
- ❌ 删除多链同步、代理质押、版本兼容等复杂逻辑
- ❌ 删除 COMET 代币的历史版本和迁移提示
- 🔧 大幅简化组件层级和状态管理
- 🎨 保证与现有 UI 系统无缝衔接

### 预期效果
- 代码量减少 70-80%（删除跨链代码后更多）
- 维护成本大幅降低
- 用户体验保持一致
- 功能完整性不受影响
- 部署和配置大幅简化

## 📊 当前问题分析

### 1. 类型系统过度复杂
```typescript
// 当前存在的冗余类型
SerializedveCometVault
SerializedLockedveCometVault  
DeserializedCometVault
DeserializedLockedCometVault
SerializedVaultUser
SerializedLockedVaultUser
DeserializedVaultUser
DeserializedLockedVaultUser
```

### 2. VaultKey 枚举混乱
```typescript
enum VaultKey {
  veCometVaultV1 = 'cometVaultV1',    // 历史版本
  veCometVault = 'cometVault',        // 当前版本  
  veCometFlexibleSideVault = 'cometFlexibleSideVault', // 侧链版本
  IfoPool = 'ifoPool',
}
```

### 3. 组件层级过深
```
CometVaultCard 
  → veCometVaultDetail 
    → veCometCard 
      → veCometUpdateCard
        → veCometMigrateCard
```

### 4. 状态管理分散
- Redux store 中有多个 vault 相关的 slice
- 每个 vault 类型都有独立的 fetch 函数
- 数据转换逻辑重复

## 🚀 重构方案

### 1. 删除跨链相关代码

#### 需要删除的跨链和迁移功能
```typescript
// 删除这些跨链相关的组件和逻辑
- CrossChainveCometCard
- 多链余额同步逻辑
- chainId 条件判断
- COMET_VAULT_SUPPORTED_CHAINS 配置
- 多链网络切换逻辑
- 跨链迁移提示

// 删除 COMET 代币迁移相关的逻辑
- COMET 代币版本检查
- 代币迁移提示组件
- 旧版本合约兼容代码
- 迁移进度跟踪
- 历史版本配置
```

#### 简化后的单链架构
```typescript
// 只保留单一 EVM 链的逻辑，无迁移逻辑，保留质押功能
interface CometConfig {
  chainId: number // 固定的主链 ID
  contracts: {
    comet: Address      // 当前版本 COMET 合约
    veComet: Address    // veCOMET 合约
    vault: Address      // 质押池合约（COMET → veCOMET）
  }
  // 删除所有历史版本和迁移相关配置
}

// 简化的代币配置
interface CometToken {
  address: Address
  decimals: number
  symbol: 'COMET'
  // 删除版本号、迁移状态等历史字段
}

// 保留的质押功能
interface StakingFeatures {
  lockComet: boolean    // ✅ 保留：锁定 COMET 获得 veCOMET
  customLockTime: boolean // ✅ 保留：自定义锁定时间
  unlockComet: boolean  // ✅ 保留：解锁 COMET
  increaseAmount: boolean // ✅ 保留：增加质押数量
  extendLock: boolean   // ✅ 保留：延长锁定时间
}
```

### 2. 统一类型系统

#### 删除冗余类型
```typescript
// 删除这些重复类型
- SerializedveCometVault vs SerializedCometVault
- DeserializedLockedCometVault vs DeserializedCometVault  
- VaultKey 的多个版本 (V1, V2, etc.)
- 各种 Locked/Flexible/Side 的变体
```

#### 新的简化类型
```typescript
interface CometStakingState {
  // COMET 相关
  comet: {
    balance: BigNumber
    staked: BigNumber      // 灵活质押的 COMET
    locked: BigNumber      // 锁定的 COMET
    price: BigNumber
  }
  
  // veCOMET 相关
  veComet: {
    balance: BigNumber     // 当前 veCOMET 余额
    votingPower: BigNumber // 投票权重
    lockEndTime: number    // 锁定结束时间
  }
  
  // 收益相关
  rewards: {
    pending: BigNumber     // 待领取奖励
    boost: number          // 收益加成倍数
    apy: number           // 年化收益率
  }
}
```

### 2. 组件架构简化

#### 当前复杂结构 → 简化后
```typescript
// 删除
veCometVaultCard → CometStakingCard
  veCometVaultDetail → 直接集成到主组件
    veCometCard → 删除
      veCometUpdateCard → 删除
        veCometMigrateCard → 删除

// 新的简化结构
<CometStaking>
  <StakingTabs>
    <FlexibleStaking />  // 灵活质押
    <LockedStaking />    // 锁定质押（产生 veCOMET）
  </StakingTabs>
  
  <StakingStats />       // 统一的数据展示
  <RewardsPanel />       // 统一的收益面板
</CometStaking>
```

### 3. 状态管理统一

#### 统一的 Redux Store
```typescript
interface CometState {
  price: BigNumber
  userBalance: BigNumber
  stakingPools: {
    flexible: FlexiblePool
    locked: LockedPool
    farms: FarmPool[]
  }
  governance: GovernanceState
}
```

#### 统一的 Hooks
```typescript
const useComet = () => {
  return {
    price: useCometPrice(),
    balance: useCometBalance(),
    staking: useCometStaking(),
    governance: useCometGovernance()
  }
}
```

### 4. 自定义锁定时间

#### 灵活的锁定选择
```typescript
const LockDurationPicker = () => {
  const [lockDays, setLockDays] = useState(365)
  
  // 计算 veCOMET 数量
  const veCometAmount = useMemo(() => {
    return calculateVeComet(cometAmount, lockDays)
  }, [cometAmount, lockDays])
  
  return (
    <Slider 
      min={1} 
      max={1460} // 4年
      value={lockDays}
      onChange={setLockDays}
    />
  )
}
```

## 📋 TODO List

### Phase 1: 清理垃圾代码 🧹

#### 1.1 删除迁移和跨链相关代码
- [ ] 删除所有 `shouldMigrate`, `isMigrated`, `needMigrate` 相关逻辑
- [ ] 删除 `useIsMigratedToveComet` hook
- [ ] 删除所有 Migration 相关组件
- [ ] 删除代理质押相关的复杂逻辑
- [ ] 删除多版本 Vault 兼容代码
- [ ] 删除 `CrossChainveCometCard` 组件
- [ ] 删除多链同步相关的所有逻辑
- [ ] 删除 `COMET_VAULT_SUPPORTED_CHAINS` 配置
- [ ] 删除 `useUserveCometStatus` 多链状态 hook
- [ ] 删除 `useveCometBalance` 多链余额 hook
- [ ] 删除所有 `chainId` 条件判断和多链切换逻辑

#### 1.2 删除 COMET 代币迁移相关代码
- [ ] 删除 COMET 代币版本检查逻辑
- [ ] 删除 COMET 代币迁移提示组件
- [ ] 删除旧版本 COMET 合约兼容代码
- [ ] 删除 COMET 代币升级相关的 hooks
- [ ] 删除历史版本的代币配置
- [ ] 删除代币迁移相关的状态管理
- [ ] 删除迁移进度跟踪逻辑
- [ ] 删除迁移完成检查逻辑

#### 1.3 删除冗余组件（保留质押功能）
- [ ] 删除 `veCometUpdateCard` 组件（迁移相关）
- [ ] 删除 `veCometMigrateCard` 组件（迁移相关）
- [ ] 删除 `veCometDelegatedCard` 组件（代理相关）
- [ ] ✅ 保留 `CometStakingCard` 组件（质押功能）
- [ ] ✅ 保留 `LockCometModal` 组件（锁定功能）
- [ ] ✅ 保留 `UnlockCometModal` 组件（解锁功能）
- [ ] 简化 `veCometVaultDetail` 组件
- [ ] 合并重复的 Vault 相关组件

#### 1.4 清理冗余类型定义
- [ ] 统一 `SerializedveCometVault` 和 `SerializedCometVault`
- [ ] 统一 `DeserializedLockedCometVault` 和 `DeserializedCometVault`
- [ ] 简化 `VaultKey` 枚举，删除历史版本
- [ ] 删除重复的 Vault User 类型定义

### Phase 2: 重构核心功能 🔧

#### 2.1 统一状态管理
- [ ] 重构 `state/pools/index.ts`，简化 vault 相关逻辑
- [ ] 统一 vault 数据获取函数，删除多链版本
- [ ] 简化 Redux actions 和 reducers
- [ ] 优化 selectors，减少重复计算
- [ ] 删除多链相关的状态管理逻辑
- [ ] 简化 chainId 相关的状态处理

#### 2.2 简化组件结构（保留质押功能）
- [ ] 重构 `veCometVaultCard` 组件，减少层级
- [ ] ✅ 保留并优化 `CometStakingCard` 组件（质押入口）
- [ ] ✅ 保留 `VaultCardActions` 组件（质押操作）
- [ ] ✅ 保留 `HasSharesActions` 组件（锁定池功能）
- [ ] 删除跨链和迁移相关的子组件
- [ ] 简化状态管理和数据流

#### 2.3 实现自定义锁定时间（核心质押功能）
- [ ] ✅ 保留并优化 `LockDurationPicker` 组件
- [ ] ✅ 保留 veCOMET 数量计算逻辑
- [ ] ✅ 保留锁定时间验证
- [ ] ✅ 保留锁定时间显示
- [ ] 删除固定锁定期限制
- [ ] 支持 1天-4年 任意锁定时间

### Phase 3: 保持 UI 兼容性 🎨

#### 3.1 保持现有组件接口
- [ ] 确保 `veCometVaultCard` props 接口不变
- [ ] 保持 `useVaultPoolByKey` hook 接口
- [ ] 维护现有的组件导出
- [ ] 保持现有的样式系统

#### 3.2 保持现有路由结构
- [ ] 确保 `/pools` 页面正常工作
- [ ] 确保 `/comet-staking` 页面正常工作
- [ ] 保持页面间导航正常
- [ ] 维护深层链接功能

#### 3.3 保持现有数据流
- [ ] 确保 API 调用格式不变
- [ ] 保持 Redux store 结构兼容
- [ ] 维护现有的错误处理
- [ ] 保持现有的加载状态

### Phase 4: 优化用户体验 ✨

#### 4.1 界面优化
- [ ] 优化锁定时间选择界面
- [ ] 改进 veCOMET 数量显示
- [ ] 优化收益展示
- [ ] 改进加载状态显示

#### 4.2 交互优化
- [ ] 优化质押流程
- [ ] 改进错误提示
- [ ] 添加操作确认
- [ ] 优化移动端体验

#### 4.3 性能优化
- [ ] 减少不必要的重渲染
- [ ] 优化数据获取逻辑
- [ ] 改进缓存策略
- [ ] 优化包大小

### Phase 5: 测试和验证 ✅

#### 5.1 功能测试
- [ ] 测试灵活质押功能
- [ ] 测试锁定质押功能
- [ ] 测试 veCOMET 生成
- [ ] 测试收益计算

#### 5.2 兼容性测试
- [ ] 测试所有现有页面
- [ ] 测试所有现有功能
- [ ] 测试样式一致性
- [ ] 测试交互正常性

#### 5.3 性能测试
- [ ] 测试页面加载速度
- [ ] 测试组件渲染性能
- [ ] 测试内存使用
- [ ] 测试网络请求优化

## 🔄 实施策略

### 渐进式重构
1. **保持外部接口不变** - 只优化内部实现
2. **逐步替换组件** - 一个组件一个组件地重构
3. **保持功能完整** - 确保每个阶段功能都正常
4. **持续测试验证** - 每个阶段都要充分测试

### 风险控制
1. **备份关键代码** - 重构前备份重要文件
2. **分支开发** - 在独立分支进行重构
3. **小步快跑** - 每次改动都要小而可控
4. **及时回滚** - 发现问题立即回滚

## 📈 预期收益

### 代码质量提升
- 代码量减少 70-80%（删除跨链代码后）
- 组件层级减少 60%
- 类型定义简化 80%
- 状态管理统一化
- 配置复杂度降低 90%

### 维护成本降低
- 新功能开发更容易
- Bug 修复更快速
- 代码审查更高效
- 文档维护更简单

### 用户体验改善
- 界面响应更快
- 操作更直观
- 功能更稳定
- 错误处理更友好

## 📝 注意事项

1. **保持向后兼容** - 确保现有功能不受影响
2. **充分测试** - 每个阶段都要进行全面测试
3. **文档更新** - 及时更新相关文档
4. **团队沟通** - 保持团队对重构进度的了解

---

**最后更新时间**: 2025-10-26  
**文档版本**: v1.0  
**负责人**: AI Assistant  
**审核状态**: 待审核
