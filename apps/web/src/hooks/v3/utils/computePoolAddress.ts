import { Token } from '@cometswap/sdk'
import { FeeAmount } from '@cometswap/v3-sdk'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256, pack } from '@ethersproject/solidity'

// V3 Factory addresses by chain
const V3_FACTORY_ADDRESSES: { [chainId: number]: string } = {
  1: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Ethereum
  56: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865', // BSC - placeholder
}

// Pool init code hash
const POOL_INIT_CODE_HASH = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'

export function computePoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  initCodeHashManualOverride,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: FeeAmount
  initCodeHashManualOverride?: string
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  
  return getCreate2Address(
    factoryAddress,
    keccak256(
      ['bytes'],
      [pack(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]
    ),
    initCodeHashManualOverride ?? POOL_INIT_CODE_HASH
  )
}

export function getV3FactoryAddress(chainId: number): string | undefined {
  return V3_FACTORY_ADDRESSES[chainId]
}


