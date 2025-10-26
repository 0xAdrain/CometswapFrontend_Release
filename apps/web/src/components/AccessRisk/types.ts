export enum TOKEN_RISK {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  VERY_HIGH = 3,
}

export interface TokenRiskInfo {
  risk_level: TOKEN_RISK
  risk_items?: string[]
  is_honeypot?: boolean
  is_blacklisted?: boolean
  is_whitelisted?: boolean
  is_open_source?: boolean
  is_proxy?: boolean
  is_mintable?: boolean
  can_take_back_ownership?: boolean
  owner_change_balance?: boolean
  hidden_owner?: boolean
  selfdestruct?: boolean
  external_call?: boolean
  gas_abuse?: boolean
}

export interface TokenSecurityResponse {
  code: number
  message: string
  result: {
    [address: string]: TokenRiskInfo
  }
}


