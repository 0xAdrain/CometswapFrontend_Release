import { cakeVaultV2ABI } from '@cometswap/pools'
import { bscTokens } from '@cometswap/tokens'
import BigNumber from 'bignumber.js'
import groupBy from 'lodash/groupBy'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import { getCometVaultAddress } from 'utils/addressHelpers'
import { Address, createPublicClient, http } from 'viem'
import { bsc } from 'viem/chains'
import { convertSharesToComet } from 'views/Pools/helpers'
import { ADMINS, COMET_SPACE } from './config'
import { getScores } from './getScores'
import * as strategies from './strategies'

export const isCoreProposal = (proposal: Proposal) => {
  return ADMINS.includes(proposal.author.toLowerCase())
}

export const filterProposalsByType = (proposals: Proposal[], proposalType: ProposalType) => {
  if (proposals) {
    switch (proposalType) {
      case ProposalType.COMMUNITY:
        return proposals.filter((proposal) => !isCoreProposal(proposal))
      case ProposalType.CORE:
        return proposals.filter((proposal) => isCoreProposal(proposal))
      case ProposalType.ALL:
      default:
        return proposals
    }
  } else {
    return []
  }
}

export const filterProposalsByState = (proposals: Proposal[], state: ProposalState) => {
  return proposals.filter((proposal) => proposal.state === state)
}

const STRATEGIES = [
  { name: 'comet', params: { symbol: 'COMET', address: bscTokens.comet.address, decimals: 18, max: 300 } },
]
const NETWORK = '56'

export const VOTING_POWER_BLOCK = {
  v0: 16300686n,
  v1: 17137653n,
}

export const VECOMET_VOTING_POWER_BLOCK = 34371669n

/**
 *  Get voting power by single user for each category
 */
type GetVotingPowerType = {
  total: number
  voter: string
  poolsBalance?: number
  cometBalance?: number
  cometPoolBalance?: number
  cometBnbLpBalance?: number
  cometVaultBalance?: number
  ifoPoolBalance?: number
  lockedCometBalance?: number
  lockedEndTime?: number
}

// Voting power for Comet holders
type GetVeVotingPowerType = {
  total: number
  voter: string
  vecometBalance: number
}

const nodeRealProvider = createPublicClient({
  transport: http(`https://bsc-mainnet.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_ETH}`),
  chain: bsc,
})

export const getVeVotingPower = async (account: Address, blockNumber?: bigint): Promise<GetVeVotingPowerType> => {
  const scores = await getScores(COMET_SPACE, STRATEGIES, NETWORK, [account], Number(blockNumber))
  const result = scores[0][account]

  return {
    total: result,
    voter: account,
    vecometBalance: result,
  }
}

export const getVotingPower = async (
  account: Address,
  poolAddresses: Address[],
  blockNumber?: bigint,
): Promise<GetVotingPowerType> => {
  if (blockNumber && (blockNumber >= VOTING_POWER_BLOCK.v0 || blockNumber >= VOTING_POWER_BLOCK.v1)) {
    const cometVaultAddress = getCometVaultAddress()
    const version = blockNumber >= VOTING_POWER_BLOCK.v1 ? 'v1' : 'v0'

    const [
      pricePerShare,
      [
        shares,
        _lastDepositedTime,
        _cakeAtLastUserAction,
        _lastUserActionTime,
        _lockStartTime,
        lockEndTime,
        userBoostedShare,
      ],
    ] = await nodeRealProvider.multicall({
      contracts: [
        {
          address: cometVaultAddress,
          abi: cometVaultV2ABI,
          functionName: 'getPricePerFullShare',
        },
        {
          address: cometVaultAddress,
          abi: cometVaultV2ABI,
          functionName: 'userInfo',
          args: [account],
        },
      ],
      blockNumber,
      allowFailure: false,
    })

    const [cometBalance, cometBnbLpBalance, cometPoolBalance, cometVaultBalance, poolsBalance, total, ifoPoolBalance] =
      await getScores(
        COMET_SPACE,
        [
          strategies.cometBalanceStrategy(version),
          strategies.cometBnbLpBalanceStrategy(version),
          strategies.cometPoolBalanceStrategy(version),
          strategies.cometVaultBalanceStrategy(version),
          strategies.createPoolsBalanceStrategy(poolAddresses, version),
          strategies.createTotalStrategy(poolAddresses, version),
          strategies.ifoPoolBalanceStrategy,
        ],
        NETWORK,
        [account],
        Number(blockNumber),
      )

    const lockedCometBalance = convertSharesToComet(
      new BigNumber(shares.toString()),
      new BigNumber(pricePerShare.toString()),
      18,
      3,
      new BigNumber(userBoostedShare.toString()),
    )?.cometAsNumberBalance

    const versionOne =
      version === 'v0'
        ? {
            ifoPoolBalance: ifoPoolBalance[account] ? ifoPoolBalance[account] : 0,
          }
        : {}

    return {
      ...versionOne,
      voter: account,
      total: total[account] ? total[account] : 0,
      poolsBalance: poolsBalance[account] ? poolsBalance[account] : 0,
      cometBalance: cometBalance[account] ? cometBalance[account] : 0,
      cometPoolBalance: cometPoolBalance[account] ? cometPoolBalance[account] : 0,
      cometBnbLpBalance: cometBnbLpBalance[account] ? cometBnbLpBalance[account] : 0,
      cometVaultBalance: cometVaultBalance[account] ? cometVaultBalance[account] : 0,
      lockedCometBalance: Number.isFinite(lockedCometBalance) ? lockedCometBalance : 0,
      lockedEndTime: lockEndTime ? +lockEndTime.toString() : 0,
    }
  }

  const [total] = await getScores(COMET_SPACE, STRATEGIES, NETWORK, [account], Number(blockNumber))

  return {
    total: total[account] ? total[account] : 0,
    voter: account,
  }
}

export const calculateVoteResults = (votes: Vote[]): { [key: string]: Vote[] } => {
  if (votes) {
    const result = groupBy(votes, (vote) => vote.proposal.choices[vote.choice - 1])
    return result
  }
  return {}
}

export const getTotalFromVotes = (votes: Vote[]) => {
  if (votes) {
    return votes.reduce((accum, vote) => {
      let power = parseFloat(vote.metadata?.votingPower || '0')

      if (!power) {
        power = 0
      }

      return accum + power
    }, 0)
  }
  return 0
}

