import {
  memo,
  forwardRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  View,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Maximize2, Minimize2 } from "lucide-react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

type FooterHelpers = {
  close: () => void;
};

type Props = Omit<TextInputProps, "multiline" | "style"> & {
  minHeight?: number;
  maxHeight?: number;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  renderFooter?: (helpers: FooterHelpers) => ReactNode;
};

export const AutoGrowingTextarea = memo(
  forwardRef<TextInput, Props>(
    (
      {
        style,
        inputStyle,
        minHeight = 100,
        maxHeight = 250,
        onContentSizeChange,
        renderFooter,
        value,
        ...rest
      },
      ref,
    ) => {
      const [height, setHeight] = useState(minHeight);
      const [isExpanded, setIsExpanded] = useState(false);

      useEffect(() => {
        setHeight(minHeight);
      }, [minHeight]);

      useEffect(() => {
        if (!value) {
          setHeight(minHeight);
        }
      }, [value, minHeight]);

      const close = useCallback(() => {
        setIsExpanded(false);
      }, []);

      const open = useCallback(() => {
        setIsExpanded(true);
      }, []);

      const handleContentSizeChange = useCallback(
        (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
          const contentHeight = event.nativeEvent.contentSize.height;
          setHeight(Math.min(maxHeight, Math.max(minHeight, contentHeight)));
          onContentSizeChange?.(event);
        },
        [maxHeight, minHeight, onContentSizeChange],
      );

      const sharedInputProps: TextInputProps = {
        value,
        multiline: true,
        underlineColorAndroid: "transparent",
        textAlignVertical: "top",
        ...rest,
      };

      return (
        <View style={[styles.container, style]}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={ref}
              {...sharedInputProps}
              style={[
                styles.textarea,
                styles.inlineInput,
                { height, minHeight },
                inputStyle,
              ]}
              scrollEnabled={height >= maxHeight}
              onContentSizeChange={handleContentSizeChange}
            />
            <Pressable
              onPress={open}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Expand textarea"
              style={styles.expandButton}
            >
              <Maximize2 size={18} color="#525252" />
            </Pressable>
          </View>

          <Modal
            visible={isExpanded}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={close}
          >
            <SafeAreaProvider>
              <SafeAreaView style={styles.fullscreenRoot} edges={["top", "right", "bottom", "left"]}>
                <KeyboardAvoidingView
                  style={styles.fullscreenRoot}
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                  <View style={styles.header}>
                    <View style={styles.headerSpacer} />
                    <Pressable
                      onPress={close}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel="Collapse textarea"
                      style={styles.collapseButton}
                    >
                      <Minimize2 size={20} color="#525252" />
                    </Pressable>
                  </View>
                  <View style={styles.fullscreenBody}>
                    <TextInput
                      {...sharedInputProps}
                      style={[
                        styles.textarea,
                        styles.fullscreenInput,
                        inputStyle,
                      ]}
                      scrollEnabled
                    />
                  </View>
                  {renderFooter ? (
                    <View style={styles.footer}>{renderFooter({ close })}</View>
                  ) : null}
                </KeyboardAvoidingView>
              </SafeAreaView>
            </SafeAreaProvider>
          </Modal>
        </View>
      );
    },
  ),
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  textarea: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 22,
    backgroundColor: "#FFFFFF",
    color: "#171717",
  },
  inlineInput: {
    paddingRight: 40,
  },
  fullscreenRoot: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D4D4D4",
  },
  headerSpacer: {
    flex: 1,
  },
  collapseButton: {
    padding: 4,
  },
  fullscreenBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fullscreenInput: {
    flex: 1,
    minHeight: 200,
    textAlignVertical: "top",
  },
  footer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D4D4D4",
  },
  expandButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 1,
  },
});

AutoGrowingTextarea.displayName = "AutoGrowingTextarea";
