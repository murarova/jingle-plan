import { memo } from "react";
import {
  Text,
  Center,
  VStack,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";

interface EmptyStateProps {
  message: string;
  onRetry?: () => void;
}

export const EmptyState = memo(({ message, onRetry }: EmptyStateProps) => (
  <Center flex={1}>
    <VStack space="md" alignItems="center">
      <Text fontSize="$xl">{message}</Text>
      {onRetry && (
        <Button onPress={onRetry}>
          <ButtonText>Retry</ButtonText>
        </Button>
      )}
    </VStack>
  </Center>
));

EmptyState.displayName = "EmptyState";

