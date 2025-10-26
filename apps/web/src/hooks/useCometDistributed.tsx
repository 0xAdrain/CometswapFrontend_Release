import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useRevenueSharingveCometPoolContract, useRevenueSharingveCometContract } from './useContract'

const INITIAL_INCENTIVE = 0n

export const useVeCometDistributed = (): bigint => {
  const cometPool = useRevenueSharingveCometPoolContract()
  const veComet = useRevenueSharingveCometContract()

  const { data: fromveCometPool = 0n } = useQuery({
    queryKey: ['cakeDistributed/cometPool', cometPool.address, cometPool.chain?.id],

    queryFn: async () => {
      try {
        const amount = (await cometPool.read.totalDistributed()) ?? 0n
        return amount
      } catch (error) {
        console.warn(error)
        return 0n
      }
    },

    placeholderData: keepPreviousData,
  })
  const { data: fromveComet = 0n } = useQuery({
    queryKey: ['cakeDistributed/veComet', veComet.address, veComet.chain?.id],

    queryFn: async () => {
      try {
        const amount = (await veComet.read.totalDistributed()) ?? 0n
        return amount
      } catch (error) {
        console.warn(error)
        return 0n
      }
    },

    placeholderData: keepPreviousData,
  })

  return INITIAL_INCENTIVE + fromveCometPool + fromveComet
}

