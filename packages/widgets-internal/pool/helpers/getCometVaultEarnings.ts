import BigNumber from "bignumber.js";
import { BIG_ZERO } from "@cometswap/utils/bigNumber";
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from "@cometswap/utils/formatBalance";

// min deposit and withdraw amount
export const MIN_LOCK_AMOUNT = new BigNumber(10000000000000);

export const ENABLE_EXTEND_LOCK_AMOUNT = new BigNumber(100000000000000);

export const convertSharesToveComet = (
  shares: BigNumber,
  cometPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
  fee?: BigNumber
) => {
  const sharePriceNumber = getBalanceNumber(cometPerFullShare, decimals);
  const amountInveComet = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO);
  const cometAsNumberBalance = getBalanceNumber(amountInveComet, decimals);
  const cometAsBigNumber = getDecimalAmount(new BigNumber(cometAsNumberBalance), decimals);
  const cometAsDisplayBalance = getFullDisplayBalance(amountInveComet, decimals, decimalsToRound);
  return { cometAsNumberBalance, cometAsBigNumber, cometAsDisplayBalance };
};

export const getveCometVaultEarnings = (
  account: string,
  cometAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
  fee?: BigNumber
) => {
  const hasAutoEarnings = account && cometAtLastUserAction?.gt(0) && userShares?.gt(0);
  const { cometAsBigNumber } = convertSharesToveComet(userShares, pricePerFullShare);
  const autoveCometProfit = cometAsBigNumber.minus(fee || BIG_ZERO).minus(cometAtLastUserAction);
  const autoveCometToDisplay = autoveCometProfit.gte(0) ? getBalanceNumber(autoveCometProfit, 18) : 0;

  const autoUsdProfit = autoveCometProfit.times(earningTokenPrice);
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0;
  return { hasAutoEarnings, autoveCometToDisplay, autoUsdToDisplay };
};

export default getveCometVaultEarnings;
