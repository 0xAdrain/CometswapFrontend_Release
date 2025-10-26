import { ASSET_CDN } from "../../../utils/endpoints";
import { Badge, BadgeLogo, BadgeText } from "./Badge";

const cometSwapLogo = `${ASSET_CDN}/web/banners/cometswap-logo.png`;

interface CometSwapBadgeProps {
  whiteText?: boolean;
  compact?: boolean;
}

export const CometSwapBadge: React.FC<React.PropsWithChildren<CometSwapBadgeProps>> = ({ whiteText, compact }) => {
  return (
    <Badge
      logo={<BadgeLogo src={cometSwapLogo} alt="cometSwapLogo" />}
      text={compact ? null : <BadgeText color={whiteText ? "#ffffff" : "#090909"}>CometSwap</BadgeText>}
    />
  );
};
