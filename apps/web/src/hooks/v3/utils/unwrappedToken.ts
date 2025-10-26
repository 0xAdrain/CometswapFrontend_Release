import { Currency, Token } from '@cometswap/sdk'

/**
 * Returns the input currency if it's not wrapped, or the native currency that wraps this wrapped currency
 * @param currency the potentially wrapped currency
 */
export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency
  if (currency.isToken) {
    const token = currency as Token
    // Check if this is a wrapped token and return the native currency if so
    // This is a simplified implementation - you might need to add more logic
    // to properly detect wrapped tokens for different chains
    if (token.symbol === 'WETH' || token.symbol === 'WBNB') {
      return Currency.getNative(token.chainId)
    }
  }
  return currency
}




