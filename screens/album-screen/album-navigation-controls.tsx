import { ChevronRightIcon, ChevronLeftIcon } from "@/components/ui/icon";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { memo } from "react";

interface AlbumNavigationControlsProps {
  onBack: () => void;
  onForward: () => void;
  currentMonth: string;
}

export const AlbumNavigationControls = memo(
  ({ onBack, onForward, currentMonth }: AlbumNavigationControlsProps) => (
    <Box
      className="flex-row items-center justify-between w-full rounded-full mt-3 bg-white shrink-0"
      style={{ paddingHorizontal: 20, paddingVertical: 4, minHeight: 48 }}
    >
      <Button
        onPress={onBack}
        size="lg"
        variant="link"
        className="h-12 min-w-12"
      >
        <ButtonIcon
          as={ChevronLeftIcon}
          className="text-warmGray-800 h-5 w-5"
        />
      </Button>
      <Center className="flex-1">
        <Text className="font-semibold text-typography-900">
          {currentMonth}
        </Text>
      </Center>
      <Button
        onPress={onForward}
        size="lg"
        variant="link"
        className="h-12 min-w-12"
      >
        <ButtonIcon
          as={ChevronRightIcon}
          className="text-warmGray-800 h-5 w-5"
        />
      </Button>
    </Box>
  ),
);

AlbumNavigationControls.displayName = "AlbumNavigationControls";
