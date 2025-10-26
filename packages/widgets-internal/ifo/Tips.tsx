import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { SpaceProps } from "styled-system";
import { FlexGap, Message, MessageText, InfoFilledIcon, Box, MessageProps, Link } from "@cometswap/uikit";
import { useTranslation } from "@cometswap/localization";
import styled from "styled-components";

type Props = {
  amount?: BigNumber | number;
} & SpaceProps;

const StyledMessage = styled(Message)`
  padding: 0.5rem;
  padding-left: 0.75rem;
`;

const WarningMessage = styled(StyledMessage).attrs({
  variant: "warning",
  icon: <InfoFilledIcon color="yellow" width={20} height={20} />,
})<Partial<MessageProps>>``;

const InfoMessage = styled(StyledMessage).attrs({
  variant: "primary",
  icon: <InfoFilledIcon color="secondary" width={20} height={20} />,
})<Partial<MessageProps>>``;

export function ZeroveCometTips({ amount = 0, ...props }: Props) {
  const { t } = useTranslation();
  const hasveComet = useMemo(() => new BigNumber(amount).toNumber() !== 0, [amount]);

  if (hasveComet) {
    return null;
  }
  return (
    <Box {...props}>
      <WarningMessage>
        <FlexGap flexDirection="column" gap="1rem">
          <MessageText>{t("You have no veCOMETat the snapshot time.")}</MessageText>
          <MessageText>
            {t("To participate, lock COMETto get veCOMET. Or extend your veCOMETposition beyond the snapshot time.")}
          </MessageText>
        </FlexGap>
      </WarningMessage>
    </Box>
  );
}

const LinkMessageText = styled(MessageText)`
  text-decoration: underline;
`;

export function MigrateveCometTips(props: SpaceProps) {
  const { t } = useTranslation();

  return (
    <Box {...props}>
      <WarningMessage>
        <FlexGap flexDirection="column" gap="1rem">
          <MessageText>
            {t("To participate, you need to migrate your fixed-term COMETstaking position to veCOMET.")}
          </MessageText>
          <LinkMessageText bold>
            <Link href="https://cometswap.finance">
              {t("Learn more")} {">>"}
            </Link>
          </LinkMessageText>
        </FlexGap>
      </WarningMessage>
    </Box>
  );
}

export function InsufficientNativecometTips(props: SpaceProps) {
  const { t } = useTranslation();

  return (
    <Box {...props}>
      <InfoMessage>
        <FlexGap flexDirection="column" gap="1rem">
          <MessageText>
            {t(
              "Position migrated from COMETPool can not be extended or topped up. To extend or add more COMET, set up a native veCOMETposition."
            )}
          </MessageText>
          <LinkMessageText bold>
            <Link
              external
              href="https://docs.cometswap.finance/products/veComet/migrate-from-comet-pool#10ffc408-be58-4fa8-af56-be9f74d03f42"
            >
              {t("Learn more")} {">>"}
            </Link>
          </LinkMessageText>
        </FlexGap>
      </InfoMessage>
    </Box>
  );
}
