import { HStack } from "@/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/ui/progress";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { memo } from "react";
import { getProgressBackgroundColor, getProgressColorByValue } from "@/utils";

interface ProgressBarProps {
  total: number;
  t: (key: string) => string;
}

export const ProgressBar = memo(({ total, t }: ProgressBarProps) => (
  <Box className="gap-3 rounded-3xl border border-ivory-line bg-ivory-card p-5">
    <HStack className="items-center justify-between">
      <Text size="md">{t("screens.processText")}</Text>
      <Box className="rounded-full bg-ivory-badge px-2.5 py-1">
        <Text size="md">{`${total}%`}</Text>
      </Box>
    </HStack>

    <Box className="w-full">
      <Progress value={total} className="h-2 bg-ivory-page">
        <ProgressFilledTrack
          className={getProgressColorByValue(total)}
          style={{ backgroundColor: getProgressBackgroundColor(total) }}
        />
      </Progress>
    </Box>
  </Box>
));

ProgressBar.displayName = "ProgressBar";

