import { ChainId } from "@cometswap/chains";
import { useTranslation } from "@cometswap/localization";
import { Box, Button, Flex, Text } from "@cometswap/uikit";
import Link from "next/link";
import { ChainLogo } from "./ChainLogo";
import { ChainNameMap, IfoChainId } from "./constants";
import { Divider, GreyCard } from "./styles";

interface NoveCometCardProps {
  userChainId?: ChainId;
  nativeChainId?: IfoChainId;
  isConnected?: boolean;
  ConnectWalletButton?: React.ReactNode;

  /**
   * onClick to open network switch modal
   * if userChainId and nativeChainId is not the same
   */
  onClick?: () => void;
}

export const NoveCometCard = ({
  nativeChainId = ChainId.BSC,
  userChainId,
  isConnected,
  ConnectWalletButton,
  onClick,
}: NoveCometCardProps) => {
  const { t } = useTranslation();

  return (
    <>
      <GreyCard>
        <Flex p="16px 16px 4px" alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <img srcSet="/images/comet-staking/token-veComet.png 2x" alt="cross-chain-veComet" width={38} />
            <ChainLogo ml="-8px" chainId={nativeChainId} />
            <Text ml="6px" fontSize="16px" bold>
              {t("veCOMETon %chainName%", {
                chainName: ChainNameMap[nativeChainId],
              })}
            </Text>
          </Flex>

          <Text bold>0</Text>
        </Flex>

        <Divider />

        <Box p="4px 16px 16px">
          <Text color="textSubtle" small>
            {t("You have no veCOMETat Snapshot time")}
          </Text>
          <br />
          <Text color="textSubtle" small>
            {t("To participate, get veCOMETor extend your veCOMETposition beyond the snapshot time.")}
          </Text>

          {!isConnected && ConnectWalletButton ? (
            <>{ConnectWalletButton}</>
          ) : userChainId && userChainId === nativeChainId ? (
            <Button mt="16px" width="100%" as={Link} href="/comet-staking">
              {t("Go to COMET Staking")}
            </Button>
          ) : (
            <Button mt="16px" width="100%" onClick={() => onClick?.()}>
              {t("Go to COMET Staking")}
            </Button>
          )}
        </Box>
      </GreyCard>
    </>
  );
};
