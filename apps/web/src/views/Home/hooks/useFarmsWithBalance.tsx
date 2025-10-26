import { getLegacyFarmConfig } from '@cometswap/farms'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { v2BCometWrapperABI } from 'config/abi/v2BCometWrapper'
import { FAST_INTERVAL } from 'config/constants'
import { SerializedFarmConfig, SerializedFarmPublicData } from 'config/constants/types'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useBCometProxyContract, useComet, useMasterchef, useMasterchefV3 } from 'hooks/useContract'
import { useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import { useCallback, useMemo } from 'react'
import { useFarmsLength } from 'state/farms/hooks'
import { useStakedPositionsByUser } from 'state/farmsV3/hooks'
import { getV2SSBCometWrapperContract } from 'utils/contractHelpers'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { publicClient } from 'utils/wagmi'
import { useWalletClient } from 'wagmi'
import { useBCometProxyContractAddress } from '../../../hooks/useBCometProxyContractAddress'
import splitProxyFarms from '../../Farms/components/YieldBooster/helpers/splitProxyFarms'

export type FarmWithBalance = {
  balance: BigNumber
  contract: any
  bCometBalance: BigNumber
  bCometContract: any | undefined
} & SerializedFarmConfig

const useFarmsWithBalance = () => {
  const { account, chainId } = useAccountActiveChain()
  const { data: poolLength } = useFarmsLength({ enabled: Boolean(account) })
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBCometProxyContractAddress(account, chainId)
  const bCometProxy = useBCometProxyContract(proxyAddress)
  const masterChefContract = useMasterchef()
  const comet = useComet()

  const masterchefV3 = useMasterchefV3()
  const { tokenIds: stakedTokenIds } = useV3TokenIdsByAccount(masterchefV3?.address, account)

  const { tokenIdResults: v3PendingComets } = useStakedPositionsByUser(stakedTokenIds)

  const { data: signer } = useWalletClient()

  const getFarmsWithBalances = useCallback(
    async (farms: SerializedFarmPublicData[], accountToCheck: string, contract) => {
      const isUserAccount = accountToCheck.toLowerCase() === account?.toLowerCase()

      const result = masterChefContract
        ? await publicClient({ chainId }).multicall({
            contracts: farms.map((farm) => ({
              abi: masterChefV2ABI,
              address: masterChefContract.address,
              functionName: 'pendingComet',
              args: [farm.pid, accountToCheck],
            })),
          })
        : undefined

      const bCometResult = isUserAccount
        ? await publicClient({ chainId }).multicall({
            contracts: farms
              .filter((farm) => Boolean(farm?.bCometWrapperAddress))
              .map((farm) => {
                return {
                  abi: v2BCometWrapperABI,
                  address: farm?.bCometWrapperAddress ?? '0x',
                  functionName: 'pendingReward',
                  args: [accountToCheck] as const,
                } as const
              }),
          })
        : []

      let bCometIndex = 0

      const proxyCometBalance =
        masterChefContract && contract.address !== masterChefContract.address && bCometProxy && comet
          ? await comet.read.balanceOf([bCometProxy.address])
          : null

      const proxyCometBalanceNumber = proxyCometBalance ? getBalanceNumber(new BigNumber(proxyCometBalance.toString())) : 0
      const results = farms.map((farm, index) => {
        let bCometBalance = BIG_ZERO
        if (isUserAccount && farm?.bCometWrapperAddress) {
          bCometBalance = new BigNumber(((bCometResult[bCometIndex].result as bigint) ?? '0').toString())
          bCometIndex++
        }
        return {
          ...farm,
          balance: result ? new BigNumber((result[index].result as bigint).toString()) : BIG_ZERO,
          bCometBalance,
        }
      })
      const farmsWithBalances: FarmWithBalance[] = results
        .filter((balanceType) => balanceType.balance.gt(0) || balanceType.bCometBalance.gt(0))
        .map((farm) => ({
          ...farm,
          contract,
          bCometContract:
            isUserAccount && farm.bCometWrapperAddress
              ? getV2SSBCometWrapperContract(farm.bCometWrapperAddress, signer ?? undefined, chainId)
              : undefined,
        }))
      const totalEarned = farmsWithBalances.reduce((accum, earning) => {
        const earningNumber = new BigNumber(earning.balance)
        const earningBCometNumber = new BigNumber(earning.bCometBalance)
        if (earningNumber.eq(0) && earningBCometNumber.eq(0)) {
          return accum
        }
        return (
          accum +
          earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber() +
          earningBCometNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
        )
      }, 0)
      return { farmsWithBalances, totalEarned: totalEarned + proxyCometBalanceNumber }
    },
    [bCometProxy, comet, chainId, masterChefContract, account, signer],
  )

  const {
    data: { farmsWithStakedBalance, earningsSum } = {
      farmsWithStakedBalance: [] as FarmWithBalance[],
      earningsSum: null,
    },
  } = useQuery({
    queryKey: [account, 'farmsWithBalance', chainId, poolLength],

    queryFn: async () => {
      if (!account || !poolLength || !chainId) return undefined
      const farmsConfig = await getLegacyFarmConfig(chainId)
      const farmsCanFetch = farmsConfig?.filter((f) => poolLength > f.pid)
      const normalBalances = await getFarmsWithBalances(farmsCanFetch ?? [], account, masterChefContract)
      if (proxyAddress && farmsCanFetch?.length && verifyBscNetwork(chainId)) {
        const { farmsWithProxy } = splitProxyFarms(farmsCanFetch)

        const proxyBalances = await getFarmsWithBalances(farmsWithProxy, proxyAddress, bCometProxy)
        return {
          farmsWithStakedBalance: [...normalBalances.farmsWithBalances, ...proxyBalances.farmsWithBalances],
          earningsSum: normalBalances.totalEarned + proxyBalances.totalEarned,
        }
      }
      return {
        farmsWithStakedBalance: normalBalances.farmsWithBalances,
        earningsSum: normalBalances.totalEarned,
      }
    },

    enabled: Boolean(account && poolLength && chainId && !isProxyContractAddressLoading),
    refetchInterval: FAST_INTERVAL,
  })

  const v3FarmsWithBalance = useMemo(
    () =>
      stakedTokenIds
        .map((tokenId, i) => {
          if (v3PendingComets?.[i] > 0n) {
            return {
              sendTx: {
                tokenId: tokenId.toString(),
                to: account,
              },
            }
          }
          return null
        })
        .filter(Boolean),
    [stakedTokenIds, v3PendingComets, account],
  )

  return useMemo(() => {
    return {
      farmsWithStakedBalance: [...farmsWithStakedBalance, ...v3FarmsWithBalance],
      earningsSum:
        (earningsSum ?? 0) +
        v3PendingComets?.reduce((accum, earning) => {
          const earningNumber = new BigNumber(earning.toString())
          if (earningNumber.eq(0)) {
            return accum
          }
          return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
        }, 0),
    }
  }, [earningsSum, farmsWithStakedBalance, v3FarmsWithBalance, v3PendingComets])
}

export default useFarmsWithBalance

