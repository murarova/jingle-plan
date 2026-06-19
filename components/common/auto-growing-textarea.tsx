import {
  memo,
  forwardRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from "react-native";

type Props = Omit<TextInputProps, "multiline" | "style"> & {
  minHeight?: number;
  maxHeight?: number;
  style?: StyleProp<TextStyle>;
};

export const AutoGrowingTextarea = memo(
  forwardRef<TextInput, Props>(
    (
      {
        style,
        minHeight = 100,
        maxHeight = 250,
        onContentSizeChange,
        ...rest
      },
      ref,
    ) => {
      const [height, setHeight] = useState(minHeight);

      useEffect(() => {
        setHeight(minHeight);
      }, [minHeight]);

      const handleContentSizeChange = useCallback(
        (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
          const contentHeight = event.nativeEvent.contentSize.height;
          setHeight(
            Math.min(maxHeight, Math.max(minHeight, contentHeight)),
          );
          onContentSizeChange?.(event);
        },
        [maxHeight, minHeight, onContentSizeChange],
      );

      return (
        <TextInput
          ref={ref}
          multiline
          style={[styles.textarea, { height, minHeight }, style]}
          onContentSizeChange={handleContentSizeChange}
          underlineColorAndroid="transparent"
          textAlignVertical="top"
          {...rest}
        />
      );
    },
  ),
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
