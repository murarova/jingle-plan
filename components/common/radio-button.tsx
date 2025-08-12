import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface RadioButtonProps {
  value: string;
  label: string;
  selected: boolean;
  onSelect: (value: string) => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  label,
  selected,
  onSelect,
  disabled = false,
  size = "medium",
}) => {
  const handlePress = () => {
    if (!disabled) {
      onSelect(value);
    }
  };

  const sizeStyles = {
    small: {
      radioCircle: { width: 16, height: 16, borderRadius: 8 },
      radioDot: { width: 6, height: 6, borderRadius: 3 },
      text: { fontSize: 14, color: "#525252" },
      padding: 8,
    },
    medium: {
      radioCircle: { width: 20, height: 20, borderRadius: 10 },
      radioDot: { width: 8, height: 8, borderRadius: 4 },
      text: { fontSize: 16, color: "#525252" },
      padding: 12,
    },
    large: {
      radioCircle: { width: 24, height: 24, borderRadius: 12 },
      radioDot: { width: 10, height: 10, borderRadius: 5 },
      text: { fontSize: 18, color: "#525252" },
      padding: 16,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <TouchableOpacity
      style={[
        styles.radioButton,
        { padding: currentSize.padding },
        disabled && styles.radioButtonDisabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.radioCircle,
          currentSize.radioCircle,
          selected && styles.radioCircleSelected,
          disabled && styles.radioCircleDisabled,
        ]}
      >
        {selected && <View style={[styles.radioDot, currentSize.radioDot]} />}
      </View>
      <Text
        style={[
          styles.radioText,
          currentSize.text,
          selected && styles.radioTextSelected,
          disabled && styles.radioTextDisabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  radioButtonSelected: {
    backgroundColor: "#fe434c",
  },
  radioButtonDisabled: {
    opacity: 0.5,
  },
  radioCircle: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  radioCircleSelected: {
    borderColor: "#fe434c",
  },
  radioCircleDisabled: {
    borderColor: "#9CA3AF",
  },
  radioDot: {
    backgroundColor: "#fe434c",
  },
  radioText: {
    color: "#000",
    flex: 1,
  },
  radioTextSelected: {
    color: "#fe434c",
  },
  radioTextDisabled: {
    color: "#9CA3AF",
  },
});
