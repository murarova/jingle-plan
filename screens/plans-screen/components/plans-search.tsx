import { Box } from "@/ui/box";
import { colors } from "@/constants/colors";
import { bodyFontSize, systemFontFamily } from "@/constants/typography";
import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";

interface PlansSearchProps {
  value: string;
  onChangeText: (value: string) => void;
  autoFocus?: boolean;
}

export function PlansSearch({ value, onChangeText, autoFocus }: PlansSearchProps) {
  const { t } = useTranslation();

  return (
    <Box className="flex-row items-center gap-1.5 rounded-xl border border-ivory-line bg-ivory-card px-2 py-[7px]">
      <Search size={16} color={colors.secondaryText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t("screens.plansScreen.searchPlaceholder")}
        placeholderTextColor={colors.secondaryText}
        accessibilityLabel={t("screens.plansScreen.searchPlaceholder")}
        testID="plans-search"
        autoFocus={autoFocus}
        className="h-6 flex-1 py-0 text-primaryText"
        style={{ fontFamily: systemFontFamily, fontSize: bodyFontSize }}
      />
    </Box>
  );
}
