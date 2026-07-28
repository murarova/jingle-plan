import { HStack } from "@/components/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { memo } from "react";
import { getProgressBackgroundColor, getProgressColorByValue } from "../../utils/utils";

interface ProgressBarProps {
  total: number;
  t: (key: string) => string;
}

export const ProgressBar = memo(({ total, t }: ProgressBarProps) => (
  <Box className="my-2.5">
    <HStack className="justify-between">
      <Text size="md">{t("screens.processText")}</Text>
      <Text size="md">{`${total}%`}</Text>
    </HStack>

    <Box className="my-2.5 mb-2.5 w-full">
      <Progress value={total} className="h-2">
        <ProgressFilledTrack
          className={getProgressColorByValue(total)}
          style={{ backgroundColor: getProgressBackgroundColor(total) }}
        />
      </Progress>
    </Box>
  </Box>
));

ProgressBar.displayName = "ProgressBar";

