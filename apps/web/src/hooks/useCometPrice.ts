import { ChainId } from '@cometswap/chains'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { chainlinkOracleCOMET} from '@cometswap/prediction'
import BigNumber from 'bignumber.js'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { publicClient } from 'utils/wagmi'
import { formatUnits } from 'viem'
import { FAST_INTERVAL } from 'config/constants'
import { useQuery } from '@tanstack/react-query'

// for migration to bignumber.js to avoid breaking changes
export const useCometPrice = ({ enabled = true } = {}) => {
  const { data } = useQuery<BigNumber, Error>({
    queryKey: ['cometPrice'],
    queryFn: async () => new BigNumber(await getCometPriceFromOracle()),
    staleTime: FAST_INTERVAL,
    refetchInterval: FAST_INTERVAL,
    enabled,
  })
  return data ?? BIG_ZERO
}
// get comet price from oracle
export const getCometPriceFromOracle = async () => {
  const data = await publicClient({ chainId: ChainId.BSC }).readContract({
    abi: chainlinkOracleABI,
    address: chainlinkOracleCOMET[ChainId.BSC],
    functionName: 'latestAnswer',
  })

  return formatUnits(data, 8)
}

