import { memo, forwardRef, ComponentProps } from "react";
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  TextInputProps,
  TextInput,
} from "react-native";
import { AutoGrowingTextInput } from "react-native-autogrow-textinput";

type AutoInputProps = ComponentProps<typeof AutoGrowingTextInput>;

type Props = Omit<
  AutoInputProps,
  "style" | "defaultHeight" | "minHeight" | "maxHeight"
> & {
  minHeight?: number;
  maxHeight?: number;
  style?: StyleProp<TextStyle>;
};

export const AutoGrowingTextarea = memo(
  forwardRef<TextInput, Props>(
    ({ style, minHeight = 100, maxHeight = 250, ...rest }, ref) => (
      <AutoGrowingTextInput
        ref={ref}
        style={[styles.textarea, { minHeight }, style]}
        defaultHeight={minHeight}
        minHeight={minHeight}
        maxHeight={maxHeight}
        underlineColorAndroid="transparent"
        {...rest}
      />
    )
  )
);

const styles = StyleSheet.create({
  textarea: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 22,
    backgroundColor: "#FFFFFF",
  },
});

AutoGrowingTextarea.displayName = "AutoGrowingTextarea";
