import { memo } from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";

interface ProgressStatProps {
  value: number;
  label: string;
}

export const ProgressStat = memo(({ value, label }: ProgressStatProps) => (
  <VStack justifyContent="center" alignItems="center">
    <Text size="xl" color={config.tokens.colors.warmGray900} fontWeight="bold">
      {value}
    </Text>
    <Text color={config.tokens.colors.warmGray400}>{label}</Text>
  </VStack>
));

ProgressStat.displayName = "ProgressStat";
