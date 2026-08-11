import {
  memo,
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useContext,
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
} from "react-native";
import { Maximize2, Minimize2 } from "lucide-react-native";
import {
  SafeAreaInsetsContext,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@/ui/modal";
import { Box } from "@/ui/box";

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

const EMPTY_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };

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
      const insets =
        useContext(SafeAreaInsetsContext) ??
        initialWindowMetrics?.insets ??
        EMPTY_INSETS;
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
            isOpen={isExpanded}
            onClose={close}
            size="full"
            avoidKeyboard
          >
            <ModalBackdrop />
            <ModalContent className="h-full w-full max-w-full flex-1 rounded-none bg-white">
              <View
                style={[
                  styles.fullscreenRoot,
                  {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                  },
                ]}
              >
                <ModalHeader className="border-b border-backgroundLight-300 px-4 py-3">
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
                </ModalHeader>
                <Box className="flex-1 px-4 py-3">
                  <TextInput
                    {...sharedInputProps}
                    style={[styles.textarea, styles.fullscreenInput, inputStyle]}
                    scrollEnabled
                  />
                </Box>
                {renderFooter ? (
                  <ModalFooter className="w-full border-t border-backgroundLight-300 px-4 py-3">
                    {renderFooter({ close })}
                  </ModalFooter>
                ) : null}
              </View>
            </ModalContent>
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
  fullscreenInput: {
    flex: 1,
    minHeight: 200,
    textAlignVertical: "top",
  },
  expandButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 1,
  },
  collapseButton: {
    padding: 4,
  },
  headerSpacer: {
    flex: 1,
  },
});

AutoGrowingTextarea.displayName = "AutoGrowingTextarea";
