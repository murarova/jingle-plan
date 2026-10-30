import { Text } from "@/ui/text";
import { VStack } from "@/ui/vstack";
import { memo } from "react";

interface ProgressStatProps {
  value: number;
  label: string;
}

export const ProgressStat = memo(({ value, label }: ProgressStatProps) => (
  <VStack className="w-[72px] items-center gap-1">
    <Text
      className="text-primaryText"
      style={{
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "700",
      }}
    >
      {value}
    </Text>
    <Text
      className="text-secondaryText"
      style={{ fontSize: 12, lineHeight: 16 }}
    >
      {label}
    </Text>
  </VStack>
));

ProgressStat.displayName = "ProgressStat";
