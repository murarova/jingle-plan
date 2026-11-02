import type { ReactNode } from "react";
import Animated from "react-native-reanimated";
import { useModalKeyboardShift } from "@/hooks/useModalKeyboardShift";

export function ModalKeyboardFrame({ children }: { children: ReactNode }) {
  const { onLayout, animatedStyle, maxHeight } = useModalKeyboardShift();

  return (
    <Animated.View
      pointerEvents="box-none"
      onLayout={onLayout}
      style={[
        { width: "100%", alignItems: "center", maxHeight },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}
