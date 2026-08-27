import { ScrollView } from "@/ui/scroll-view";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { Pressable } from "@/ui/pressable";
import { Modal, ModalBackdrop, ModalContent } from "@/ui/modal";
import { SafeAreaView } from "@/components/common/safe-area-view";
import { memo, useCallback, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react-native";

interface AlbumItemTextProps {
  text: string;
}

export const AlbumItemText = memo(({ text }: AlbumItemTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const openExpanded = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const closeExpanded = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return (
    <Box className="relative h-[30%] overflow-hidden rounded-b-lg bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 p-[10px] pr-10"
      >
        <Text>{text}</Text>
      </ScrollView>
      <Pressable
        onPress={openExpanded}
        className="absolute right-2 top-2 p-1"
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Expand text"
      >
        <Maximize2 size={18} color="#737373" />
      </Pressable>
      <Modal isOpen={isExpanded} onClose={closeExpanded} size="full">
        <ModalBackdrop />
        <ModalContent className="h-full w-full max-w-full rounded-none bg-white">
          <SafeAreaView className="flex-1 bg-white">
            <Box className="flex-row items-center justify-end px-3 pb-2 pt-1">
              <Pressable
                onPress={closeExpanded}
                className="p-2"
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Collapse text"
              >
                <Minimize2 size={20} color="#737373" />
              </Pressable>
            </Box>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <Text className="px-4 py-3 text-base leading-[22px] text-black">
                {text}
              </Text>
            </ScrollView>
          </SafeAreaView>
        </ModalContent>
      </Modal>
    </Box>
  );
});

AlbumItemText.displayName = "AlbumItemText";
