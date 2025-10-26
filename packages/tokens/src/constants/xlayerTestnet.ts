import { ChainId, ERC20Token } from '@cometswap/sdk'

export interface ChainTokenList {
  [symbol: string]: ERC20Token
}

export const xlayerTestnetTokens: ChainTokenList = {
  wokb: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x204547b0b12f4dFc0e0c623498Ded0E2d3a97d6e',
    18,
    'WOKB',
    'Wrapped OKB',
    'https://www.okx.com/',
  ),
  mwokb: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0xFCF165C4C8925682aE5facEC596D474eB36CE825',
    18,
    'mWOKB',
    'Mock Wrapped OKB',
    'https://www.okx.com/',
  ),
  comet: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x2e3E7F38F30f33D8fcE5F9574DF8181b839dFe8d',
    18,
    'COMET',
    'CometSwap Token',
    'https://cometswap.io/',
  ),
  musdt: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0xE196aaADEbAcCE2354Aa414D202E0AB1C907d8B5',
    6,
    'mUSDT',
    'Mock Tether USD',
    'https://tether.to/',
  ),
  musdc: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x70b759Ba2ca756fAD20B232De07F583AA5E676FC',
    6,
    'mUSDC',
    'Mock USD Coin',
    'https://www.centre.io/',
  ),
  mwbtc: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x3f806e22414060286632d5f5C67B6afbD4B1D7b9',
    8,
    'mWBTC',
    'Mock Wrapped BTC',
    'https://wbtc.network/',
  ),
  meth: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0xb16637fA04A286C0EE2874935970cdA0b595e16a',
    18,
    'mETH',
    'Mock Ethereum',
    'https://ethereum.org/',
  ),
  mdai: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x4Ec24e2da05F7C6fC54C3234137E07d0A8826610',
    18,
    'mDAI',
    'Mock Dai Stablecoin',
    'https://makerdao.com/',
  ),
  mmeme: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x826DB476956eE85D9b3807dE4889945f9dd81740',
    18,
    'mMEME',
    'Mock Meme Token',
    'https://example.com/',
  ),
}





























