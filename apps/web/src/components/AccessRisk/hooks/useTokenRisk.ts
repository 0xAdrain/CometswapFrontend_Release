import { useQuery } from '@tanstack/react-query'
import { TOKEN_RISK } from '../types'

interface TokenRiskData {
  risk_level: number
  risk_items?: string[]
}

export function useTokenRisk(tokenAddress?: string, chainId?: number) {
  const { data: tokenRisk, isLoading: loading } = useQuery({
    queryKey: ['tokenRisk', tokenAddress, chainId],
    queryFn: async (): Promise<TokenRiskData | null> => {
      if (!tokenAddress || !chainId) return null
      
      try {
        // Mock implementation - replace with actual API call
        // const response = await fetch(`https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${tokenAddress}`)
        // const data = await response.json()
        
        // For now, return a mock response
        return {
          risk_level: TOKEN_RISK.LOW,
          risk_items: []
        }
      } catch (error) {
        console.error('Error fetching token risk:', error)
        return null
      }
    },
    enabled: Boolean(tokenAddress && chainId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  return {
    tokenRisk,
    loading,
  }
}




