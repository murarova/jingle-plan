import { VStack } from "@/ui/vstack";
import { AppButton } from "./app-button";
import { Center } from "@/ui/center";
import { Text } from "@/ui/text";
import { memo } from "react";

interface EmptyStateProps {
  message: string;
  onRetry?: () => void;
}

export const EmptyState = memo(({ message, onRetry }: EmptyStateProps) => (
  <Center className="flex-1">
    <VStack space="md" className="items-center">
      <Text className="text-xl">{message}</Text>
      {onRetry && (
        <AppButton label="Retry" onPress={onRetry} />
      )}
    </VStack>
  </Center>
));

EmptyState.displayName = "EmptyState";

