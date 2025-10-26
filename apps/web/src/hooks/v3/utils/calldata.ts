import { Interface } from '@ethersproject/abi'
import { BigintIsh } from '@cometswap/sdk'

// Helper functions for encoding calldata
export function encodeRouteToPath(route: any[], exactOutput: boolean): string {
  const firstInputToken = route[0]
  const { path, types } = route.reduce(
    (
      { inputToken, path: pathSoFar, types: typesSoFar }: { inputToken: any; path: string; types: string[] },
      pool: any,
      i: number
    ) => {
      const outputToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0
      if (i === 0) {
        return {
          inputToken: outputToken,
          types: ['address', 'uint24', 'address'],
          path: encodeAddress(inputToken.address) + encodeFee(pool.fee) + encodeAddress(outputToken.address),
        }
      } else {
        return {
          inputToken: outputToken,
          types: [...typesSoFar, 'uint24', 'address'],
          path: pathSoFar + encodeFee(pool.fee) + encodeAddress(outputToken.address),
        }
      }
    },
    { inputToken: firstInputToken, path: '0x', types: [] }
  )

  return exactOutput ? reverseBytes(path) : path
}

function encodeAddress(address: string): string {
  return address.slice(2).toLowerCase()
}

function encodeFee(fee: number): string {
  return fee.toString(16).padStart(6, '0')
}

function reverseBytes(hex: string): string {
  const bytes = hex.slice(2).match(/.{2}/g) || []
  return '0x' + bytes.reverse().join('')
}

// Multicall encoding
export function encodeMulticall(calls: string[]): string {
  const multicallInterface = new Interface([
    'function multicall(bytes[] calldata data) external payable returns (bytes[] memory results)',
  ])
  
  return multicallInterface.encodeFunctionData('multicall', [calls])
}

// Position manager calldata encoding
export function encodeMintParams(params: {
  token0: string
  token1: string
  fee: number
  tickLower: number
  tickUpper: number
  amount0Desired: BigintIsh
  amount1Desired: BigintIsh
  amount0Min: BigintIsh
  amount1Min: BigintIsh
  recipient: string
  deadline: BigintIsh
}): string {
  const positionManagerInterface = new Interface([
    'function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)',
  ])
  
  return positionManagerInterface.encodeFunctionData('mint', [params])
}




