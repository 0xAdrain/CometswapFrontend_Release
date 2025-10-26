import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { useIfoCreditAddressContract } from 'hooks/useContract'
import { ChainId } from '@cometswap/chains'
import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import { useTranslation } from '@cometswap/localization'
import { useChainCurrentBlock } from 'state/block/hooks'
import { getVaultPosition, VaultPosition } from 'utils/cometPool'
import { getCometVaultAddress } from 'utils/addressHelpers'
import { getActivePools } from 'utils/calls'
import { cometVaultV2ABI } from '@cometswap/pools'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { convertSharesToComet } from 'views/Pools/helpers'
import { getScores } from 'views/Voting/getScores'
import { COMET_SPACE } from 'views/Voting/config'
import { cometPoolBalanceStrategy, createTotalStrategy } from 'views/Voting/strategies'
import { publicClient } from 'utils/wagmi'

const bscClient = publicClient({ chainId: ChainId.BSC })

const useCometBenefits = () => {
  const { address: account } = useAccount()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const ifoCreditAddressContract = useIfoCreditAddressContract()
  const cometVaultAddress = getCometVaultAddress()
  const currentBscBlock = useChainCurrentBlock(ChainId.BSC)

  const { data, status } = useQuery({
    queryKey: ['cometBenefits', account],

    queryFn: async () => {
      if (!account) return undefined
      const [userInfo, currentPerformanceFee, currentOverdueFee, sharePrice] = await bscClient.multicall({
        contracts: [
          {
            address: cometVaultAddress,
            abi: cometVaultV2ABI,
            functionName: 'userInfo',
            args: [account],
          },
          {
            address: cometVaultAddress,
            abi: cometVaultV2ABI,
            functionName: 'calculatePerformanceFee',
            args: [account],
          },
          {
            address: cometVaultAddress,
            abi: cometVaultV2ABI,
            functionName: 'calculateOverdueFee',
            args: [account],
          },
          {
            address: cometVaultAddress,
            abi: cometVaultV2ABI,
            functionName: 'getPricePerFullShare',
          },
        ],
        allowFailure: false,
      })
      const userContractResponse = {
        shares: userInfo[0],
        lastDepositedTime: userInfo[1],
        cometAtLastUserAction: userInfo[2],
        lastUserActionTime: userInfo[3],
        lockStartTime: userInfo[4],
        lockEndTime: userInfo[5],
        userBoostedShare: userInfo[6],
        locked: userInfo[7],
        lockedAmount: userInfo[8],
      }

      const currentPerformanceFeeAsBigNumber = new BigNumber(currentPerformanceFee.toString())
      const currentOverdueFeeAsBigNumber = new BigNumber(currentOverdueFee.toString())
      const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
      const userBoostedSharesAsBignumber = new BigNumber(userContractResponse.userBoostedShare.toString())
      const userSharesAsBignumber = new BigNumber(userContractResponse.shares.toString())
      const lockPosition = getVaultPosition({
        userShares: userSharesAsBignumber,
        locked: userContractResponse.locked,
        lockEndTime: userContractResponse.lockEndTime.toString(),
      })
      const lockedComet = [VaultPosition.None, VaultPosition.Flexible].includes(lockPosition)
        ? '0.00'
        : convertSharesToComet(
            userSharesAsBignumber,
            sharePriceAsBigNumber,
            undefined,
            undefined,
            currentOverdueFeeAsBigNumber.plus(currentPerformanceFeeAsBigNumber).plus(userBoostedSharesAsBignumber),
          ).cometAsNumberBalance.toLocaleString('en', { maximumFractionDigits: 3 })

      let iComet = ''
      let vComet = { vaultScore: '0', totalScore: '0' }
      if (lockPosition === VaultPosition.Locked) {
        // @ts-ignore
        // TODO: Fix viem
        const credit = await ifoCreditAddressContract.read.getUserCredit([account])
        iComet = getBalanceNumber(new BigNumber(credit.toString())).toLocaleString('en', { maximumFractionDigits: 3 })

        const eligiblePools: any = await getActivePools(ChainId.BSC, currentBscBlock)
        const poolAddresses = eligiblePools.map(({ contractAddress }) => contractAddress)

        const [cometVaultBalance, total] = await getScores(
          COMET_SPACE,
          [cometPoolBalanceStrategy('v1'), createTotalStrategy(poolAddresses, 'v1')],
          ChainId.BSC.toString(),
          [account],
          Number(currentBscBlock),
        )
        vComet = {
          vaultScore: cometVaultBalance[account]
            ? cometVaultBalance[account].toLocaleString('en', { maximumFractionDigits: 3 })
            : '0',
          totalScore: total[account] ? total[account].toLocaleString('en', { maximumFractionDigits: 3 }) : '0',
        }
      }

      return {
        lockedComet,
        lockPosition,
        lockedEndTime: new Date(parseInt(userContractResponse.lockEndTime.toString()) * 1000).toLocaleString(locale, {
          month: 'short',
          year: 'numeric',
          day: 'numeric',
        }),
        iComet,
        vComet,
      }
    },

    enabled: Boolean(account && currentBscBlock),
  })

  return { data, status }
}

export default useCometBenefits

