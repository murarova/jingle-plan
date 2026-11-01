import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

type Registry = {
  register: (node: View) => () => void;
  reveal: () => void;
};

const RegistryContext = createContext<Registry | null>(null);

export function useKeyboardAwareReveal() {
  return useContext(RegistryContext)?.reveal;
}

export function KeyboardAwareGroup({ children }: { children: ReactNode }) {
  const ref = useRef<View>(null);
  const registry = useContext(RegistryContext);

  useEffect(() => {
    const node = ref.current;
    if (!registry || !node) {
      return;
    }
    return registry.register(node);
  }, [registry]);

  return (
    <View ref={ref} collapsable={false} style={{ width: "100%" }}>
      {children}
    </View>
  );
}

export function KeyboardAwareScroll({
  children,
  extraBelowInput = EXTRA_BELOW_INPUT,
}: KeyboardAwareScrollProps) {
  const scrollRef = useRef<ScrollView>(null);
  const containerRef = useRef<View>(null);
  const groups = useRef(new Set<View>());
  const offsetY = useRef(0);
  const keyboardTop = useRef(Number.POSITIVE_INFINITY);
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

    const scrollTargetIntoView = (top: number, height: number) => {
      container.measureInWindow((_sx, sy, _sw, sh) => {
        const visibleBottom = Math.min(sy + sh, keyboardTop.current);
        const targetBottom = top + height + extraBelow.current;
        const delta = targetBottom - visibleBottom;
        if (delta > 1) {
          scroll.scrollTo({
            y: Math.max(0, offsetY.current + delta),
            animated: true,
          });
        }
      });
    };

    input.measureInWindow((_x, y) => {
      const candidates = [...groups.current];
      if (candidates.length === 0) {
        return;
      }

      let pending = candidates.length;
      let best: { y: number; height: number } | null = null;

      candidates.forEach((group) => {
        group.measureInWindow((_gx, gy, _gw, gh) => {
          const contains = y >= gy - 1 && y <= gy + gh + 1;
          if (contains && (best === null || gh < best.height)) {
            best = { y: gy, height: gh };
          }
          pending -= 1;
          if (pending === 0 && best) {
            scrollTargetIntoView(best.y, best.height);
          }
        });
      });
    });
  }, []);

  const ensureRef = useRef(ensureFocusedInputVisible);
  ensureRef.current = ensureFocusedInputVisible;

  const registry = useMemo<Registry>(
    () => ({
      register: (node) => {
        groups.current.add(node);
        return () => {
          groups.current.delete(node);
        };
      },
      reveal: () => {
        ensureRef.current();
      },
    }),
    [],
  );

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvent, (event) => {
      keyboardTop.current = event.endCoordinates.screenY;
      setKeyboardInset(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      keyboardTop.current = Number.POSITIVE_INFINITY;
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

    let innerFrame = 0;
    const frame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        ensureFocusedInputVisible();
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(innerFrame);
    };
  }, [keyboardInset, ensureFocusedInputVisible]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetY.current = event.nativeEvent.contentOffset.y;
  };

  return (
    <RegistryContext.Provider value={registry}>
      <View ref={containerRef} style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: extraBelowInput + keyboardInset,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {children}
        </ScrollView>
      </View>
    </RegistryContext.Provider>
  );
}
