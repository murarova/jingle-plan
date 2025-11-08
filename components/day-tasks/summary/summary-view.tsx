import { memo } from "react";
import { Box, Text, VStack } from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { HappySlider } from "./happy-slider";
import { ActionButtons } from "../../common";

interface SummaryViewProps {
  text: string;
  rate: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const SummaryView = memo(
  ({ text, rate, onEdit, onDelete }: SummaryViewProps) => {
    const { t } = useTranslation();

    return (
      <VStack space="md" width="100%">
        <HappySlider rate={rate} setRate={() => {}} isDisabled={true} />
        <Box mb="$2">
          <Text>{text || t("common.empty")}</Text>
        </Box>
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </VStack>
    );
  }
);

SummaryView.displayName = "SummaryView";
