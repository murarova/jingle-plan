import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
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
        <Button onPress={onRetry}>
          <ButtonText>Retry</ButtonText>
        </Button>
      )}
    </VStack>
  </Center>
));

EmptyState.displayName = "EmptyState";

