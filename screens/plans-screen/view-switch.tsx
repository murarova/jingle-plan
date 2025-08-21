import { useMemo, memo } from "react";
import { Box } from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import SwitchSelector from "react-native-switch-selector";
import { PlansViewOptions } from "../../constants/constants";

interface ViewSwitchProps {
  onViewChange: (value: PlansViewOptions) => void;
}

export const ViewSwitch = memo(({ onViewChange }: ViewSwitchProps) => {
  const { t } = useTranslation();

  const switchOptions = useMemo(
    () => [
      {
        label: t("screens.plansScreen.byContext"),
        value: PlansViewOptions.context,
      },
      {
        label: t("screens.plansScreen.byMonth"),
        value: PlansViewOptions.month,
      },
    ],
    [t]
  );

  return (
    <Box mt="$4" mx="$2">
      <SwitchSelector
        initial={0}
        onPress={onViewChange}
        textColor="#000"
        selectedColor="#000"
        buttonColor="#fff"
        borderColor="#EBEBEB"
        backgroundColor="#EBEBEB"
        hasPadding
        height={32}
        borderRadius={7}
        options={switchOptions}
        testID="view-switch-selector"
        accessibilityLabel="view-switch-selector"
      />
    </Box>
  );
});

ViewSwitch.displayName = "ViewSwitch";
