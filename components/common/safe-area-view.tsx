import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  useSafeAreaInsets,
  type Edge,
} from "react-native-safe-area-context";
import { Box } from "@/ui/box";

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
  const insets = useSafeAreaInsets();

  const safeAreaStyle: StyleProp<ViewStyle> = {
    paddingTop: edges.includes("top") ? insets.top : undefined,
    paddingBottom: edges.includes("bottom") ? insets.bottom : undefined,
    paddingLeft: edges.includes("left") ? insets.left : undefined,
    paddingRight: edges.includes("right") ? insets.right : undefined,
  };

  return <Box ref={ref} style={[safeAreaStyle, style]} {...props} />;
});

SafeAreaView.displayName = "SafeAreaView";
