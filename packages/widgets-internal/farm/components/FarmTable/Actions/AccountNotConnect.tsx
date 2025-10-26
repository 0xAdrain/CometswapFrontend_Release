import { useTranslation } from "@cometswap/localization";
import { Text } from "@cometswap/uikit";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

const AccountNotConnect = ({
  children,
  bveCometInfoSlot,
}: {
  children: React.ReactNode;
  bveCometInfoSlot?: React.ReactElement;
}) => {
  const { t } = useTranslation();

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Start Farming")}
        </Text>
      </ActionTitles>
      <ActionContent style={{ justifyContent: "flex-start", alignItems: "center", gap: 16 }}>{children}</ActionContent>
      {bveCometInfoSlot}
    </StyledActionContainer>
  );
};

export default AccountNotConnect;
