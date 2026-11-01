import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { findNodeHandle, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  measure,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";
import {
  useKeyboardHandler,
  useReanimatedFocusedInput,
  useWindowDimensions,
} from "react-native-keyboard-controller";

const EXTRA_BELOW_INPUT = 20;

type KeyboardAwareScrollProps = {
  children: ReactNode;
  extraBelowInput?: number;
};

type Frame = { top: number; bottom: number };

type Registry = {
  register: (node: View) => () => void;
  measureAll: () => void;
};

const RegistryContext = createContext<Registry | null>(null);

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
    <View
      ref={ref}
      collapsable={false}
      onLayout={registry?.measureAll}
      style={{ width: "100%" }}
    >
      {children}
    </View>
  );
}

export function KeyboardAwareScroll({
  children,
  extraBelowInput = EXTRA_BELOW_INPUT,
}: KeyboardAwareScrollProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const contentRef = useRef<View>(null);
  const groups = useRef(new Map<View, Frame>());
  const offset = useScrollViewOffset(scrollRef);
  const scrollTag = useSharedValue<number | null>(null);
  const frames = useSharedValue<Frame[]>([]);
  const keyboardHeight = useSharedValue(0);
  const spacerHeight = useSharedValue(0);
  const fromHeight = useSharedValue(0);
  const toHeight = useSharedValue(0);
  const fromOffset = useSharedValue(0);
  const distance = useSharedValue(0);
  const inputTarget = useSharedValue(-1);
  const inputTop = useSharedValue(0);
  const inputHeight = useSharedValue(0);
  const { input } = useReanimatedFocusedInput();
  const { height: windowHeight } = useWindowDimensions();

  const registry = useMemo<Registry>(() => {
    const publish = () => {
      frames.value = [...groups.current.values()];
    };

    const measureNode = (node: View) => {
      const content = contentRef.current;
      if (!content) {
        return;
      }
      node.measureLayout(content, (_x, y, _w, height) => {
        if (!groups.current.has(node)) {
          return;
        }
        groups.current.set(node, { top: y, bottom: y + height });
        publish();
      });
    };

    return {
      register: (node) => {
        groups.current.set(node, { top: 0, bottom: 0 });
        measureNode(node);
        return () => {
          groups.current.delete(node);
          publish();
        };
      },
      measureAll: () => {
        groups.current.forEach((_frame, node) => measureNode(node));
      },
    };
  }, [frames]);

  const syncInput = useCallback(() => {
    "worklet";
    const focused = input.value;
    const container = measure(scrollRef);
    if (
      !focused ||
      !container ||
      focused.parentScrollViewTarget !== scrollTag.value
    ) {
      inputTarget.value = -1;
      return;
    }
    inputTarget.value = focused.target;
    inputTop.value = focused.layout.absoluteY - container.pageY + offset.value;
    inputHeight.value = focused.layout.height;
  }, [input, inputHeight, inputTarget, inputTop, offset, scrollRef, scrollTag]);

  const revealDistance = useCallback(
    (keyboard: number) => {
      "worklet";
      if (inputTarget.value === -1) {
        return 0;
      }
      const container = measure(scrollRef);
      if (!container) {
        return 0;
      }

      const inputBottom = inputTop.value + inputHeight.value;
      let groupBottom = inputBottom;
      let smallest = Number.POSITIVE_INFINITY;
      for (const frame of frames.value) {
        const size = frame.bottom - frame.top;
        if (
          inputTop.value >= frame.top - 1 &&
          inputTop.value <= frame.bottom + 1 &&
          size < smallest
        ) {
          smallest = size;
          groupBottom = frame.bottom;
        }
      }
      const target = Math.max(inputBottom, groupBottom);

      const visibleHeight = Math.min(
        container.height,
        windowHeight - keyboard - container.pageY,
      );
      const overlap = target + extraBelowInput - (offset.value + visibleHeight);
      const keepInputTopVisible =
        inputTop.value - offset.value - extraBelowInput;
      return Math.max(0, Math.min(overlap, keepInputTopVisible));
    },
    [
      extraBelowInput,
      frames,
      inputHeight,
      inputTarget,
      inputTop,
      offset,
      scrollRef,
      windowHeight,
    ],
  );

  const revealNow = useCallback(() => {
    "worklet";
    if (keyboardHeight.value === 0) {
      return;
    }
    const shift = revealDistance(keyboardHeight.value);
    if (shift > 0) {
      scrollTo(scrollRef, 0, offset.value + shift, true);
    }
  }, [keyboardHeight, offset, revealDistance, scrollRef]);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";
        fromHeight.value = keyboardHeight.value;
        toHeight.value = e.height;
        fromOffset.value = offset.value;
        spacerHeight.value = Math.max(spacerHeight.value, e.height);
        if (e.height > 0 && input.value?.target !== inputTarget.value) {
          syncInput();
        }
        distance.value = e.height > 0 ? revealDistance(e.height) : 0;

        if (distance.value > 0 && fromHeight.value === e.height) {
          scrollTo(scrollRef, 0, fromOffset.value + distance.value, true);
          distance.value = 0;
        }
      },
      onMove: (e) => {
        "worklet";
        keyboardHeight.value = e.height;
        spacerHeight.value = Math.max(e.height, toHeight.value);

        if (distance.value > 0) {
          const progress = interpolate(
            e.height,
            [fromHeight.value, toHeight.value],
            [0, 1],
            Extrapolation.CLAMP,
          );
          scrollTo(
            scrollRef,
            0,
            fromOffset.value + distance.value * progress,
            false,
          );
        }
      },
      onEnd: (e) => {
        "worklet";
        keyboardHeight.value = e.height;
        spacerHeight.value = e.height;

        if (distance.value > 0) {
          scrollTo(scrollRef, 0, fromOffset.value + distance.value, false);
          distance.value = 0;
        }
      },
    },
    [input, inputTarget, revealDistance, syncInput],
  );

  useAnimatedReaction(
    () => input.value,
    (current, previous) => {
      if (current === previous) {
        return;
      }
      syncInput();
      if (
        current &&
        current.target === previous?.target &&
        current.layout.height !== previous.layout.height
      ) {
        revealNow();
      }
    },
    [revealNow, syncInput],
  );

  useAnimatedReaction(
    () => frames.value,
    (current, previous) => {
      if (previous !== null && current !== previous) {
        revealNow();
      }
    },
    [revealNow],
  );

  const spacerStyle = useAnimatedStyle(() => ({
    height: spacerHeight.value,
  }));

  const onScrollLayout = useCallback(() => {
    scrollTag.value = findNodeHandle(scrollRef.current);
  }, [scrollRef, scrollTag]);

  return (
    <RegistryContext.Provider value={registry}>
      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: extraBelowInput }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        onLayout={onScrollLayout}
      >
        <View
          ref={contentRef}
          collapsable={false}
          onLayout={registry.measureAll}
        >
          {children}
        </View>
        <Animated.View style={spacerStyle} />
      </Animated.ScrollView>
    </RegistryContext.Provider>
  );
}
