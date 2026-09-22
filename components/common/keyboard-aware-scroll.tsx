import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

const EXTRA_BELOW_INPUT = 10;

type KeyboardAwareScrollProps = {
  children: ReactNode;
  extraBelowInput?: number;
};

export function KeyboardAwareScroll({
  children,
  extraBelowInput = EXTRA_BELOW_INPUT,
}: KeyboardAwareScrollProps) {
  const scrollRef = useRef<ScrollView>(null);
  const containerRef = useRef<View>(null);
  const offsetY = useRef(0);
  const keyboardHeight = useRef(0);
  const extraBelow = useRef(extraBelowInput);
  extraBelow.current = extraBelowInput;
  const [keyboardInset, setKeyboardInset] = useState(0);

  const ensureFocusedInputVisible = useCallback(() => {
    const input = TextInput.State.currentlyFocusedInput();
    const scroll = scrollRef.current;
    const container = containerRef.current;
    if (!input || !scroll || !container) {
      return;
    }

    input.measureInWindow((_x, y, _w, height) => {
      container.measureInWindow((_sx, sy, _sw, sh) => {
        const coveredByKeyboard =
          Platform.OS === "ios" ? keyboardHeight.current : 0;
        const visibleBottom = sy + sh - coveredByKeyboard;
        const targetBottom = y + height + extraBelow.current;
        const delta = targetBottom - visibleBottom;
        if (delta > 1) {
          scroll.scrollTo({
            y: Math.max(0, offsetY.current + delta),
            animated: true,
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvent, (event) => {
      keyboardHeight.current = event.endCoordinates.height;
      setKeyboardInset(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      keyboardHeight.current = 0;
      setKeyboardInset(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (keyboardInset === 0) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      ensureFocusedInputVisible();
    });

    return () => cancelAnimationFrame(frame);
  }, [keyboardInset, ensureFocusedInputVisible]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetY.current = event.nativeEvent.contentOffset.y;
  };

  return (
    <View ref={containerRef} style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom:
            extraBelowInput + (Platform.OS === "ios" ? keyboardInset : 0),
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>
    </View>
  );
}
