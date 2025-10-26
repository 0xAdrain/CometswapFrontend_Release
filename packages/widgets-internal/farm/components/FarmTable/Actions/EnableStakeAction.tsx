import { useTranslation } from "@cometswap/localization";
import { Button, Text, useMatchBreakpoints } from "@cometswap/uikit";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

export interface EnableStakeActionProps {
  pendingTx: boolean;
  handleApprove: () => void;
  bveCometInfoSlot?: React.ReactElement;
}

const EnableStakeAction: React.FunctionComponent<React.PropsWithChildren<EnableStakeActionProps>> = ({
  pendingTx,
  handleApprove,
  bveCometInfoSlot,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useMatchBreakpoints();
  return (
    <StyledActionContainer
      style={
        bveCometInfoSlot
          ? {
              display: "flex",
              gap: 16,
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              minHeight: isMobile ? "auto" : undefined,
            }
          : undefined
      }
    >
      {!bveCometInfoSlot && (
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t("Enable Farm")}
          </Text>
        </ActionTitles>
      )}
      <ActionContent style={bveCometInfoSlot ? { flexGrow: 1, width: isMobile ? "100%" : "30%" } : undefined}>
        <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary">
          {t("Enable")}
        </Button>
      </ActionContent>
      {bveCometInfoSlot}
    </StyledActionContainer>
  );
};

export default EnableStakeAction;
