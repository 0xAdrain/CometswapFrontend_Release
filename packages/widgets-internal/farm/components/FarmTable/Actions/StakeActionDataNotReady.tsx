import { useTranslation } from "@cometswap/localization";
import { Skeleton, Text } from "@cometswap/uikit";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

const StakeActionDataNotReady: React.FC<{ bveCometInfoSlot?: React.ReactElement }> = ({ bveCometInfoSlot }) => {
  const { t } = useTranslation();
  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Start Farming")}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Skeleton width={180} marginBottom={28} marginTop={14} />
      </ActionContent>
      {bveCometInfoSlot}
    </StyledActionContainer>
  );
};

export default StakeActionDataNotReady;
