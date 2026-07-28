import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { memo } from "react";
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
      <VStack space="md" className="w-full">
        <HappySlider rate={rate} setRate={() => {}} isDisabled={true} />
        <Box className="mb-2">
          <Text>{text || t("common.empty")}</Text>
        </Box>
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </VStack>
    );
  }
);

SummaryView.displayName = "SummaryView";
