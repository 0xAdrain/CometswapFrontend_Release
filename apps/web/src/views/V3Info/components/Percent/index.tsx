import { Text, TextProps } from '@cometswap/uikit'
import { styled } from 'styled-components'

const Wrapper = styled(Text)<{ negative: boolean }>`
  color: ${({ theme, negative }) => (negative ? theme.colors.failure : theme.colors.success)};
  font-weight: 500;
`

interface PercentProps extends TextProps {
  value: number
  decimals?: number
  fontSize?: string
  fontWeight?: number
  wrap?: boolean
}

const Percent: React.FC<React.PropsWithChildren<PercentProps>> = ({
  value,
  decimals = 2,
  fontSize = '16px',
  fontWeight = 500,
  wrap = false,
  ...rest
}) => {
  const truncated = parseFloat(value.toFixed(decimals))

  if (truncated === 0) {
    return (
      <Wrapper {...rest} fontWeight={fontWeight} fontSize={fontSize} negative={false}>
        0%
      </Wrapper>
    )
  }

  return (
    <Wrapper {...rest} fontWeight={fontWeight} fontSize={fontSize} negative={truncated < 0}>
      {wrap && '('}
      {truncated < 0 && '-'}
      {truncated > 0 && '+'}
      {Math.abs(value).toFixed(decimals)}%{wrap && ')'}
    </Wrapper>
  )
}

export default Percent