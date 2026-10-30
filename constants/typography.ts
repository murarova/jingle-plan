import { Platform, type TextStyle } from "react-native";

export const systemFontFamily = Platform.select({
  ios: "System",
  android: "sans-serif",
  default: "System",
});

const typeFont = "ios:font-system android:font-roboto";

export const typeRole = {
  screenTitle: `${typeFont} ios:text-[17px] ios:leading-[22px] ios:font-semibold android:text-[22px] android:leading-[28px] android:font-normal`,
  cardHeading: `${typeFont} text-[20px] leading-[25px] font-semibold`,
  body: `${typeFont} text-[17px] leading-[22px]`,
  secondary: `${typeFont} text-[15px] leading-[20px]`,
  button: `${typeFont} text-[17px] leading-[22px] font-semibold`,
  supporting: `${typeFont} text-[13px] leading-[18px]`,
} as const;

export const bodyFontSize = 17;
export const secondaryFontSize = 15;

export const screenTitleStyle: TextStyle = {
  fontFamily: systemFontFamily,
  fontSize: Platform.OS === "android" ? 22 : 17,
  lineHeight: Platform.OS === "android" ? 28 : 22,
  fontWeight: Platform.OS === "android" ? "400" : "600",
};
