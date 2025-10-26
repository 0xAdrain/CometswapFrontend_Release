import { DocumentNode } from 'graphql'
import { GraphQLClient } from 'graphql-request'

// GraphQL client configuration
const GRAPH_API_ENDPOINT = process.env.NEXT_PUBLIC_GRAPH_API_ENDPOINT || 'https://api.thegraph.com/subgraphs/name/cometswap/exchange-v2'

const graphQLClient = new GraphQLClient(GRAPH_API_ENDPOINT)

// Generic GraphQL query function
export async function request<T = any>(
  document: string | DocumentNode,
  variables?: Record<string, any>
): Promise<T> {
  try {
    return await graphQLClient.request<T>(document, variables)
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw error
  }
}

// Batch GraphQL requests
export async function batchRequests<T = any>(
  documents: Array<{ document: string | DocumentNode; variables?: Record<string, any> }>
): Promise<T[]> {
  try {
    const promises = documents.map(({ document, variables }) => 
      graphQLClient.request(document, variables)
    )
    return await Promise.all(promises)
  } catch (error) {
    console.error('Batch GraphQL requests failed:', error)
    throw error
  }
}

// Helper function to create GraphQL client with custom endpoint
export function createGraphQLClient(endpoint: string): GraphQLClient {
  return new GraphQLClient(endpoint)
}

// Common GraphQL fragments
export const PAIR_FRAGMENT = `
  fragment PairFields on Pair {
    id
    token0 {
      id
      symbol
      name
      decimals
    }
    token1 {
      id
      symbol
      name
      decimals
    }
    reserve0
    reserve1
    totalSupply
    reserveUSD
    volumeUSD
    untrackedVolumeUSD
    txCount
    createdAtTimestamp
    createdAtBlockNumber
  }
`

export const TOKEN_FRAGMENT = `
  fragment TokenFields on Token {
    id
    symbol
    name
    decimals
    totalSupply
    tradeVolume
    tradeVolumeUSD
    untrackedVolumeUSD
    txCount
    totalLiquidity
    derivedETH
  }
`

// Common queries
export const GET_PAIRS = `
  query GetPairs($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    pairs(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      ...PairFields
    }
  }
  ${PAIR_FRAGMENT}
`

export const GET_TOKENS = `
  query GetTokens($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    tokens(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      ...TokenFields
    }
  }
  ${TOKEN_FRAGMENT}
`

export const GET_PAIR_BY_ID = `
  query GetPairById($id: ID!) {
    pair(id: $id) {
      ...PairFields
    }
  }
  ${PAIR_FRAGMENT}
`

export const GET_TOKEN_BY_ID = `
  query GetTokenById($id: ID!) {
    token(id: $id) {
      ...TokenFields
    }
  }
  ${TOKEN_FRAGMENT}
`