import type {
  DeserializedCometVault,
  DeserializedLockedCometVault,
  DeserializedLockedVaultUser,
  DeserializedPool,
  DeserializedPoolConfig,
  DeserializedPoolLockedVault,
  DeserializedPoolVault,
  DeserializedVaultFees,
  DeserializedVaultUser,
  PoolCategory,
  PoolConfigBaseProps,
  SerializedPoolConfig,
  SerializedVaultFees,
} from "@cometswap/pools";
import { VaultKey } from "@cometswap/pools";
import BigNumber from "bignumber.js";

export {
  DeserializedCometVault,
  DeserializedLockedCometVault,
  DeserializedLockedVaultUser,
  DeserializedPool,
  DeserializedPoolConfig,
  DeserializedPoolLockedVault,
  DeserializedPoolVault,
  DeserializedVaultFees,
  DeserializedVaultUser,
  PoolCategory,
  PoolConfigBaseProps,
  SerializedPoolConfig,
  SerializedVaultFees,
  VaultKey,
};

export interface HarvestActionsProps {
  earnings: BigNumber;
  isLoading?: boolean;
  onPresentCollect: any;
  earningTokenPrice: number;
  earningTokenBalance: number;
  earningTokenDollarBalance: number;
  disabledHarvestButton?: boolean;
}
