import React from "react";
import { styled } from "styled-components";
import LogoRound from "../Svg/Icons/LogoRound";
import Text from "../Text/Text";
import Skeleton from "../Skeleton/Skeleton";
import { Colors } from "../../theme";

export interface Props {
  color?: keyof Colors;
  cometPriceUsd?: number;
  showSkeleton?: boolean;
  chainId: number;
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  &:hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const CometPrice: React.FC<React.PropsWithChildren<Props>> = ({
  cometPriceUsd,
  color = "textSubtle",
  showSkeleton = true,
  chainId,
}) => {
  return cometPriceUsd ? (
    <PriceLink
      href={`https://cometswap.finance/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=${chainId}`}
      target="_blank"
    >
      <LogoRound width="24px" mr="8px" />
      <Text color={color} bold>{`$${cometPriceUsd.toFixed(3)}`}</Text>
    </PriceLink>
  ) : showSkeleton ? (
    <Skeleton width={80} height={24} />
  ) : null;
};

export default React.memo(CometPrice);




