import { FlexGap } from "@cometswap/uikit";
import Image from "next/legacy/image";
import { VerticalDivider } from "../VerticalDivider";
import { BadgeLogo } from "./Badge";
import { CometSwapBadge } from "./CometSwapBadge";

export type CoBrandBadgeProps = {
  whiteText?: boolean;
  compact?: boolean;
  coBrandLogo: string;
  coBrand: string;
  coBrandAlt?: string;
  cWidth?: number | `${number}`;
  cHeight?: number | `${number}`;
  dividerBg?: string;
};

export const CoBrandBadge: React.FC<React.PropsWithChildren<CoBrandBadgeProps>> = ({
  whiteText,
  compact,
  coBrandLogo,
  coBrand,
  coBrandAlt = "",
  cWidth,
  cHeight,
  dividerBg,
}) => {
  if (compact) {
    return (
      <FlexGap gap="4px">
        <CometSwapBadge whiteText={whiteText} compact />
        <VerticalDivider bg={dividerBg ?? ""} />
        <BadgeLogo src={coBrandLogo} alt={coBrandAlt} />
      </FlexGap>
    );
  }

  return (
    <FlexGap gap="8px" alignItems="center">
      <CometSwapBadge whiteText={whiteText} />
      <VerticalDivider bg={dividerBg ?? ""} />
      {cWidth && cHeight ? <Image src={coBrand} alt={coBrandAlt} width={cWidth} height={cHeight} unoptimized /> : null}
    </FlexGap>
  );
};
