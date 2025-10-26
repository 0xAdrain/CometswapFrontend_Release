import { Box, Flex, ProfileAvatar, Text } from '@cometswap/uikit'
import { useProfileForAddress } from 'state/profile/hooks'
import { styled } from 'styled-components'
import truncateHash from '@cometswap/utils/truncateHash'
import { useDomainNameForAddress } from 'hooks/useDomain'

const StyledFlex = styled(Flex)`
  align-items: center;
  cursor: pointer;
  
  &:hover {
    opacity: 0.6;
  }
`

interface WinnerProps {
  address: string
  potteryVaultAddress: string
  totalWinners: string
}

const Winner: React.FC<React.PropsWithChildren<WinnerProps>> = ({ 
  address, 
  totalWinners 
}) => {
  const { profile } = useProfileForAddress(address)
  const { domainName } = useDomainNameForAddress(address)

  const avatar = profile?.nft?.image?.thumbnail || '/images/nfts/no-profile-md.png'

  const handleClick = () => {
    // Handle winner click
  }

  return (
    <StyledFlex onClick={handleClick}>
      <Box>
        <ProfileAvatar
          width={24}
          height={24}
          src={avatar}
        />
        <Box ml="4px">
          <Text fontSize="12px" color="primary">
            {domainName || truncateHash(address)}
          </Text>
          <Text minHeight="18px" fontSize="12px" color="primary">
            {profile?.username ? `@${profile.username}` : null}
          </Text>
        </Box>
      </Box>
      <Box ml="auto">
        <Text fontSize="12px" color="textSubtle">
          {totalWinners} {parseInt(totalWinners) === 1 ? 'winner' : 'winners'}
        </Text>
      </Box>
    </StyledFlex>
  )
}

export default Winner