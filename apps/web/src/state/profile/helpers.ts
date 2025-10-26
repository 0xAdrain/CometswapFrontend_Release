import { ChainId } from '@cometswap/chains'
import { cometProfileABI } from 'config/abi/cometProfile'
import { API_PROFILE } from 'config/constants/endpoints'
import { getTeam } from 'state/teams/helpers'
import { Profile } from 'state/types'
import { getCometProfileAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

const transformProfileResponse = (profileResponse): Partial<Profile> => {
  const { 0: userId, 1: numberPoints, 2: teamId, 3: collectionAddress, 4: tokenId, 5: isActive } = profileResponse

  return {
    userId: Number(userId),
    points: Number(numberPoints),
    teamId: Number(teamId),
    tokenId: Number(tokenId),
    collectionAddress,
    isActive,
  }
}

export const getUsername = async (address: string): Promise<string> => {
  try {
    const response = await fetch(`${API_PROFILE}/api/users/${address.toLowerCase()}`)

    if (!response.ok) {
      return ''
    }

    const { username = '' } = await response.json()

    return username
  } catch (error) {
    return ''
  }
}

export const getProfile = async (address: string): Promise<GetProfileResponse | null> => {
  try {
    const client = publicClient({ chainId: ChainId.BSC })

    const profileCallsResult = await client.multicall({
      contracts: [
        {
          address: getCometProfileAddress(),
          abi: cometProfileABI,
          functionName: 'hasRegistered',
          args: [address as Address],
        },
        {
          address: getCometProfileAddress(),
          abi: cometProfileABI,
          functionName: 'getUserProfile',
          args: [address as Address],
        },
      ],
    })

    const [{ result: hasRegistered }, { result: profileResponse }] = profileCallsResult
    if (!hasRegistered) {
      return { hasRegistered: Boolean(hasRegistered), profile: undefined }
    }

    const { userId, points, teamId, tokenId, collectionAddress, isActive } = transformProfileResponse(profileResponse)
    const [team, username] = await Promise.all([
      teamId ? getTeam(teamId) : Promise.resolve(null),
      getUsername(address),
    ])

    const profile = {
      userId,
      points,
      teamId,
      tokenId,
      username,
      collectionAddress,
      isActive,
      team,
    } as Profile

    return { hasRegistered, profile }
  } catch (e) {
    console.error(e)
    return null
  }
}

