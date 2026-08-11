import {
  memo,
  forwardRef,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInput,
  TextInputProps,
  View,
  Pressable,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { Maximize2, Minimize2 } from "lucide-react-native";
import {
  SafeAreaInsetsContext,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "@/ui/keyboard-avoiding-view";

const FALLBACK_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };

type Props = Omit<TextInputProps, "multiline" | "style"> & {
  minHeight?: number;
  maxHeight?: number;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  expandable?: boolean;
};

export const AutoGrowingTextarea = memo(
  forwardRef<TextInput, Props>(
    (
      {
        style,
        containerStyle,
        minHeight = 100,
        maxHeight = 250,
        expandable = true,
        value,
        onChangeText,
        ...rest
      },
      ref,
    ) => {
      const [isExpanded, setIsExpanded] = useState(false);
      const [expandedDefaultValue, setExpandedDefaultValue] = useState("");
      const [expandedSession, setExpandedSession] = useState(0);
      const compactInputRef = useRef<TextInput | null>(null);
      const insets =
        useContext(SafeAreaInsetsContext) ??
        initialWindowMetrics?.insets ??
        FALLBACK_INSETS;

      const setCompactRef = useCallback(
        (node: TextInput | null) => {
          compactInputRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        },
        [ref],
      );

      const closeExpanded = useCallback(() => {
        setIsExpanded(false);
      }, []);

      const openExpanded = useCallback(() => {
        compactInputRef.current?.blur();
        setExpandedDefaultValue(typeof value === "string" ? value : "");
        setExpandedSession((session) => session + 1);
        setIsExpanded(true);
      }, [value]);

      const handleExpandedChange = useCallback(
        (text: string) => {
          onChangeText?.(text);
        },
        [onChangeText],
      );

      return (
        <View style={[styles.container, containerStyle]}>
          <View style={styles.compactWrapper}>
            <TextInput
              {...rest}
              ref={setCompactRef}
              value={value}
              onChangeText={onChangeText}
              multiline
              editable={!isExpanded}
              style={[
                styles.textarea,
                expandable && styles.textareaWithIcon,
                { minHeight, maxHeight },
                style,
              ]}
              underlineColorAndroid="transparent"
              textAlignVertical="top"
            />
            {expandable ? (
              <Pressable
                onPress={openExpanded}
                style={styles.expandButton}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Expand textarea"
              >
                <Maximize2 size={18} color="#737373" />
              </Pressable>
            ) : null}
          </View>

          {expandable ? (
            <Modal
              visible={isExpanded}
              animationType="fade"
              presentationStyle="fullScreen"
              onRequestClose={closeExpanded}
            >
              <View
                style={[
                  styles.expandedSafeArea,
                  {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                  },
                ]}
              >
                <KeyboardAvoidingView
                  style={styles.expandedRoot}
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                  <View style={styles.expandedHeader}>
                    <Pressable
                      onPress={closeExpanded}
                      style={styles.collapseButton}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel="Collapse textarea"
                    >
                      <Minimize2 size={20} color="#737373" />
                    </Pressable>
                  </View>
                  <ScrollView
                    style={styles.expandedScroll}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="interactive"
                  >
                    <TextInput
                      {...rest}
                      key={expandedSession}
                      autoFocus
                      multiline
                      scrollEnabled={false}
                      defaultValue={expandedDefaultValue}
                      onChangeText={handleExpandedChange}
                      style={styles.expandedTextarea}
                      underlineColorAndroid="transparent"
                      textAlignVertical="top"
                    />
                  </ScrollView>
                </KeyboardAvoidingView>
              </View>
            </Modal>
          ) : null}
        </View>
      );
    },
  ),
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  compactWrapper: {
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
  },
  textareaWithIcon: {
    paddingRight: 40,
  },
  expandButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },
  expandedSafeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  expandedRoot: {
    flex: 1,
  },
  expandedHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  collapseButton: {
    padding: 8,
  },
  expandedScroll: {
    flex: 1,
  },
  expandedTextarea: {
    width: "100%",
    minHeight: 240,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
    color: "#000000",
  },
});

AutoGrowingTextarea.displayName = "AutoGrowingTextarea";
