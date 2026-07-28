// @ts-nocheck
import React from "react";
import { config } from "./config";
import { View, ViewProps } from "react-native";
import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import {
  useGluestackColors as useGluestackColorsHook,
  useCalendarTheme as useCalendarThemeHook,
} from "./useGluestackColors";

export type ModeType = "light";

export const useGluestackColors = useGluestackColorsHook;
export const useCalendarTheme = useCalendarThemeHook;
export type { GluestackColors } from "./useGluestackColors";

export function GluestackUIProvider({
  mode: _mode = "light",
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps["style"];
}) {
  return (
    <View
      style={[
        config.light,
        { flex: 1, height: "100%", width: "100%" },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
