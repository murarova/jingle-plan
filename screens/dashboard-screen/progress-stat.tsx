import { Text } from "@/ui/text";
import { VStack } from "@/ui/vstack";
import { memo } from "react";

interface ProgressStatProps {
  value: number;
  label: string;
}

export const ProgressStat = memo(({ value, label }: ProgressStatProps) => (
  <VStack className="justify-center items-center">
    <Text size="xl" className="text-warmGray-900 font-bold">
      {value}
    </Text>
    <Text className="text-warmGray-400">{label}</Text>
  </VStack>
));

ProgressStat.displayName = "ProgressStat";
