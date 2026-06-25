import { memo } from "react";
import {
  Box,
  Button,
  Text,
  Center,
  ChevronRightIcon,
  ButtonIcon,
  ChevronLeftIcon,
} from "@gluestack-ui/themed";

interface AlbumNavigationControlsProps {
  onBack: () => void;
  onForward: () => void;
  currentMonth: string;
}

export const AlbumNavigationControls = memo(
  ({ onBack, onForward, currentMonth }: AlbumNavigationControlsProps) => (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      borderRadius="$full"
      mt="$3"
      px="$5"
      backgroundColor="$white"
      flexShrink={0}
    >
      <Button onPress={onBack} size="xl" variant="link">
        <ButtonIcon color="$warmGray800" as={ChevronLeftIcon} />
      </Button>
      <Center flex={1}>
        <Text fontWeight={600}>{currentMonth}</Text>
      </Center>
      <Button onPress={onForward} size="xl" variant="link">
        <ButtonIcon color="$warmGray800" as={ChevronRightIcon} />
      </Button>
    </Box>
  ),
);

AlbumNavigationControls.displayName = "AlbumNavigationControls";
