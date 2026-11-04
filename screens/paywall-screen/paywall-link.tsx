import { Text } from "@/ui/text";
import { Pressable } from "@/ui/pressable";
import { typeRole } from "@/constants/typography";

export function PaywallLink({
  label,
  onPress,
  disabled,
  className,
  emphasized,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  emphasized?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      className={`py-1 ${className ?? ""}`}
    >
      <Text
        className={`${typeRole.supporting} ${
          emphasized
            ? "font-semibold text-primaryText"
            : "text-secondaryText"
        }`}
        style={emphasized ? undefined : { textDecorationLine: "underline" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
