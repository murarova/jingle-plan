import { DefaultTheme } from "@react-navigation/native";
import { colors } from "@/constants/colors";

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "#292524",
    background: colors.ivoryPage,
    card: colors.ivoryPage,
    border: colors.ivoryLine,
  },
};
