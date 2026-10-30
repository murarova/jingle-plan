import { Button, ButtonText } from "@/ui/button";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  isDisabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  className,
  isDisabled,
  accessibilityLabel,
  testID,
}: AppButtonProps) {
  const isSecondary = variant === "secondary";

  return (
    <Button
      testID={testID}
      variant={isSecondary ? "outline" : "default"}
      onPress={onPress}
      isDisabled={isDisabled}
      accessibilityLabel={accessibilityLabel}
      className={`h-[42px] rounded-[14px] px-5 ${
        isSecondary ? "border-ivory-line bg-[#f4f0e8]" : "bg-primary-500"
      } ${className ?? ""}`}
    >
      <ButtonText
        className={`${
          isSecondary ? "text-[#403b33]" : "text-white"
        } ios:leading-[24px] android:leading-[24px]`}
      >
        {label}
      </ButtonText>
    </Button>
  );
}
