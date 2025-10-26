export interface V4ArticleDataType {
  id: string
  title: string
  content: string
  slug: string
  createAt: string
  publishedAt: string
  description: string
  imgUrl: string
  categories: string[]
}

export enum TagValue {
  ALL = 'all',
  TRADING = 'trading',
  LIQUIDITY = 'liquidity',
  YIELD = 'yield',
  GOVERNANCE = 'governance',
  ANALYTICS = 'analytics',
}

export enum TagType {
  CATEGORY = 'category',
  FEATURE = 'feature',
}

export enum HooksType {
  TRADING = 'trading',
  LIQUIDITY = 'liquidity',
  YIELD = 'yield',
  GOVERNANCE = 'governance',
  ANALYTICS = 'analytics',
}




