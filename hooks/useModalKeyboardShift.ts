import { useCallback } from "react";
import type { LayoutChangeEvent } from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import {
  useKeyboardState,
  useReanimatedKeyboardAnimation,
  useWindowDimensions,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GAP = 16;

export function useModalKeyboardShift() {
  const { height: keyboardOffset } = useReanimatedKeyboardAnimation();
  const { height: windowHeight } = useWindowDimensions();
  const { top: topInset } = useSafeAreaInsets();
  const keyboardHeight = useKeyboardState((state) =>
    state.isVisible ? state.height : 0,
  );
  const frameTop = useSharedValue(0);
  const frameHeight = useSharedValue(0);
  const minTop = topInset + GAP;

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      frameTop.value = event.nativeEvent.layout.y;
      frameHeight.value = event.nativeEvent.layout.height;
    },
    [frameHeight, frameTop],
  );

  const animatedStyle = useAnimatedStyle(() => {
    const keyboard = -keyboardOffset.value;
    if (keyboard <= 0 || frameHeight.value === 0) {
      return { transform: [{ translateY: 0 }] };
    }
    const space = windowHeight - keyboard - minTop;
    const targetTop = minTop + Math.max(0, (space - frameHeight.value) / 2);
    return {
      transform: [{ translateY: Math.min(0, targetTop - frameTop.value) }],
    };
  });

  const maxHeight =
    keyboardHeight > 0
      ? windowHeight - keyboardHeight - minTop - GAP
      : undefined;

  return { onLayout, animatedStyle, maxHeight };
}
