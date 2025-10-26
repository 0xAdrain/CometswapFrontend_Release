import { ChainId } from '@cometswap/chains'
import { bscTokens } from '@cometswap/tokens'
import { useQuery } from '@tanstack/react-query'
import { getActivePools } from 'utils/calls'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { VECOMET_VOTING_POWER_BLOCK, getVeVotingPower, getVotingPower } from '../helpers'

interface State {
  cometBalance?: number
  cometVaultBalance?: number
  cometPoolBalance?: number
  poolsBalance?: number
  cometBnbLpBalance?: number
  ifoPoolBalance?: number
  total: number
  lockedCometBalance?: number
  lockedEndTime?: number
  vecometBalance?: number
}

const useGetVotingPower = (block?: number): State & { isLoading: boolean; isError: boolean } => {
  const { address: account } = useAccount()
  const { data, status, error } = useQuery({
    queryKey: [account, block, 'votingPower'],

    queryFn: async () => {
      if (!account) {
        throw new Error('No account')
      }
      const blockNumber = block ? BigInt(block) : await publicClient({ chainId: ChainId.BSC }).getBlockNumber()
      if (blockNumber >= VECOMET_VOTING_POWER_BLOCK) {
        return getVeVotingPower(account, blockNumber)
      }
      const eligiblePools = await getActivePools(ChainId.BSC, Number(blockNumber))
      const poolAddresses: Address[] = eligiblePools
        .filter((pair) => pair.stakingToken.address.toLowerCase() === bscTokens.comet.address.toLowerCase())
        .map(({ contractAddress }) => contractAddress)

      const {
        cometBalance,
        cometBnbLpBalance,
        cometPoolBalance,
        total,
        poolsBalance,
        cometVaultBalance,
        ifoPoolBalance,
        lockedCometBalance,
        lockedEndTime,
      } = await getVotingPower(account, poolAddresses, blockNumber)
      return {
        cometBalance,
        cometBnbLpBalance,
        cometPoolBalance,
        poolsBalance,
        cometVaultBalance,
        ifoPoolBalance,
        total,
        lockedCometBalance,
        lockedEndTime,
      }
    },

    enabled: Boolean(account),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  if (error) console.error(error)

  return { total: 0, ...data, isLoading: status !== 'success', isError: status === 'error' }
}

export default useGetVotingPower

