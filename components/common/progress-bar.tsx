import { memo } from "react";
import {
  Box,
  Text,
  Center,
  Progress,
  ProgressFilledTrack,
  HStack,
} from "@gluestack-ui/themed";
import { getProgressColorByValue } from "../../utils/utils";

interface ProgressBarProps {
  total: number;
  t: (key: string) => string;
}

export const ProgressBar = memo(({ total, t }: ProgressBarProps) => (
  <Box my="$2.5">
    <HStack justifyContent="space-between">
      <Text size="md">{t("screens.processText")}</Text>
      <Text size="md">{`${total}%`}</Text>
    </HStack>

    <Center my="$2.5" mb="$2.5">
      <Progress value={total} size="sm">
        <ProgressFilledTrack bg={getProgressColorByValue(total)} />
      </Progress>
    </Center>
  </Box>
));

ProgressBar.displayName = "ProgressBar";

