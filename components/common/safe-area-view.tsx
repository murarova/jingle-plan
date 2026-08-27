import React, { useContext } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  SafeAreaInsetsContext,
  initialWindowMetrics,
  type Edge,
} from "react-native-safe-area-context";
import { Box } from "@/ui/box";

const FALLBACK_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };

type SafeAreaViewProps = React.ComponentProps<typeof Box> & {
  edges?: readonly Edge[];
};

export const SafeAreaView = React.forwardRef<
  React.ComponentRef<typeof Box>,
  SafeAreaViewProps
>(function SafeAreaView(
  { edges = ["top", "right", "bottom", "left"], style, ...props },
  ref
) {
  const insets =
    useContext(SafeAreaInsetsContext) ??
    initialWindowMetrics?.insets ??
    FALLBACK_INSETS;

  const safeAreaStyle: StyleProp<ViewStyle> = {
    paddingTop: edges.includes("top") ? insets.top : undefined,
    paddingBottom: edges.includes("bottom") ? insets.bottom : undefined,
    paddingLeft: edges.includes("left") ? insets.left : undefined,
    paddingRight: edges.includes("right") ? insets.right : undefined,
  };

  return <Box ref={ref} style={[safeAreaStyle, style]} {...props} />;
});

SafeAreaView.displayName = "SafeAreaView";
