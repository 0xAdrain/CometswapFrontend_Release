import { ERC20Token } from "@cometswap/sdk";
import { ChainId } from "@cometswap/chains";

// For StoryBook
export const cometToken = new ERC20Token(
  ChainId.BSC,
  "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  18,
  "COMET",
  "CometSwap Token",
  "https://cometswap.finance/"
);

export const bscToken = new ERC20Token(
  ChainId.BSC,
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  18,
  "BNB",
  "BNB",
  "https://www.binance.com/"
);
