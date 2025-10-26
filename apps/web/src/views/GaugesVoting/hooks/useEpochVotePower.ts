import { useQuery } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeCometContract } from 'hooks/useContract'
import { isAddressEqual } from 'utils'
import { Address, zeroAddress } from 'viem'
import { useVeCometUserInfo } from 'views/CometStaking/hooks/useVeCometUserInfo'
import { useNextEpochStart } from './useEpochTime'

export const useEpochVotePower = () => {
  const nextEpoch = useNextEpochStart()
  const contract = useVeCometContract()
  const { account } = useAccountActiveChain()
  const { data: userInfo } = useVeCometUserInfo()

  const { data, isLoading } = useQuery({
    queryKey: ['epochVotePower', nextEpoch, contract.address, contract.chain?.id],

    queryFn: async () => {
      if (!contract || !nextEpoch) return 0n
      const votePower = await contract.read.balanceOfAtTime([account!, BigInt(nextEpoch)])
      const proxyVotePower =
        !userInfo?.cakePoolProxy ||
        userInfo?.cakePoolProxy === '0x' ||
        isAddressEqual(userInfo?.cakePoolProxy, zeroAddress)
          ? 0n
          : await contract.read.balanceOfAtTime([userInfo?.cakePoolProxy as Address, BigInt(nextEpoch)])
      // const proxyVotePower = await contract.read.balanceOfAtForProxy([account!, BigInt(nextEpoch)])
      return votePower + proxyVotePower
    },

    enabled: !!nextEpoch && !!contract.address && !!account,
  })

  return { data: data ?? 0n, isLoading }
}

