/* eslint-disable react/no-unescaped-entities */
import { styled } from 'styled-components'
import { Flex, Text, Link } from '@cometswap/uikit'

export const Container = styled(Flex)`
  flex-direction: column;
  align-items: center;
  flex: 1;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    overflow: visible;
  }
`

export const LeftWrapper = styled(Flex)`
  flex-direction: column;
  flex: 1;
  padding-bottom: 40px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-bottom: 0px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding-left: 32px;
    padding-right: 32px;
  }
`

export const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0 24px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 16px;
  }
`

const TermsOfService = () => {
  return (
    <Container>
      <LeftWrapper>
        <Text fontSize="40px" fontWeight="600" color="text" mb="24px">
          Terms of Service
        </Text>
        
        <Text fontSize="16px" color="textSubtle" mb="24px">
          Last updated: [Date]
        </Text>

        <Text fontSize="16px" color="text" mb="16px">
          Welcome to CometSwap. These Terms of Service ("Terms") govern your use of our decentralized exchange platform and related services.
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          1. Acceptance of Terms
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          By accessing or using CometSwap, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our services.
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          2. Description of Service
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          CometSwap is a decentralized exchange (DEX) that allows users to trade cryptocurrencies and provide liquidity to earn rewards.
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          3. Risks
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          Trading cryptocurrencies involves substantial risk of loss. You acknowledge that you understand these risks and trade at your own risk.
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          4. User Responsibilities
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          You are responsible for:
        </Text>
        <Text fontSize="16px" color="text" mb="8px" ml="16px">
          • Maintaining the security of your wallet and private keys
        </Text>
        <Text fontSize="16px" color="text" mb="8px" ml="16px">
          • Complying with applicable laws and regulations
        </Text>
        <Text fontSize="16px" color="text" mb="16px" ml="16px">
          • Conducting your own research before trading
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          5. Prohibited Activities
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          You may not use CometSwap for any illegal activities, market manipulation, or activities that could harm the platform or other users.
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          6. Disclaimer of Warranties
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          CometSwap is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of our services.
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          7. Limitation of Liability
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          To the maximum extent permitted by law, CometSwap shall not be liable for any indirect, incidental, special, or consequential damages.
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          8. Privacy Policy
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use information.
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          9. Modifications
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting.
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          10. Governing Law
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          These Terms shall be governed by and construed in accordance with applicable laws.
        </Text>

        <Text fontSize="20px" fontWeight="600" color="text" mb="16px">
          11. Contact Information
        </Text>
        <Text fontSize="16px" color="text" mb="16px">
          If you have any questions about these Terms, please contact us through our official channels.
        </Text>

        <Text fontSize="16px" color="textSubtle" mt="32px">
          By using CometSwap, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </Text>
      </LeftWrapper>
    </Container>
  )
}

export default TermsOfService