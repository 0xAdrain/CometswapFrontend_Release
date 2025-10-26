import { Trans } from '@cometswap/localization'
import { Link, Text } from '@cometswap/uikit'

export const swapFAQ = [
  {
    id: 'what-is-swap',
    title: 'What is CometSwap?',
    content: (
      <Text>
        <Trans>
          CometSwap is a decentralized exchange (DEX) that allows you to trade cryptocurrencies directly from your wallet without intermediaries.
        </Trans>
      </Text>
    ),
  },
  {
    id: 'how-to-swap',
    title: 'How do I swap tokens?',
    content: (
      <Text>
        <Trans>
          1. Connect your wallet
          2. Select the tokens you want to swap
          3. Enter the amount
          4. Review the transaction details
          5. Confirm the swap
        </Trans>
      </Text>
    ),
  },
  {
    id: 'swap-fees',
    title: 'What are the fees?',
    content: (
      <Text>
        <Trans>
          CometSwap charges a 0.25% trading fee on each swap. This fee goes to liquidity providers who supply tokens to the pools.
        </Trans>
      </Text>
    ),
  },
  {
    id: 'slippage',
    title: 'What is slippage?',
    content: (
      <Text>
        <Trans>
          Slippage is the difference between the expected price of a trade and the actual price. It occurs due to market volatility and liquidity. You can adjust slippage tolerance in settings.
        </Trans>
      </Text>
    ),
  },
  {
    id: 'failed-transaction',
    title: 'Why did my transaction fail?',
    content: (
      <Text>
        <Trans>
          Transactions can fail due to:
          • Insufficient gas fees
          • High slippage
          • Network congestion
          • Token approval issues
          Try increasing gas fees or slippage tolerance.
        </Trans>
      </Text>
    ),
  },
  {
    id: 'token-not-found',
    title: 'Token not found in the list?',
    content: (
      <Text>
        <Trans>
          You can import any token by pasting its contract address. However, be careful and only import tokens you trust. Always verify the contract address from official sources.
        </Trans>
      </Text>
    ),
  },
  {
    id: 'price-impact',
    title: 'What is price impact?',
    content: (
      <Text>
        <Trans>
          Price impact is how much your trade affects the token price. Large trades in small pools can have high price impact. Consider splitting large trades into smaller ones.
        </Trans>
      </Text>
    ),
  },
  {
    id: 'support',
    title: 'Need more help?',
    content: (
      <Text>
        <Trans>
          Visit our{' '}
          <Link href="https://docs.cometswap.finance" external>
            documentation
          </Link>{' '}
          or join our community for support.
        </Trans>
      </Text>
    ),
  },
]