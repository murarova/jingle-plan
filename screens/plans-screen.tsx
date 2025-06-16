import { useState, useMemo, memo } from "react";
import { EmptyScreen } from "../components/empty-screen";
import { Loader } from "../components/common";
import { PlansContextView } from "../components/plans-view/plans-context-view";
import { usePlansScreen } from "../components/plans-view/hooks/usePlansScreen";
import SwitchSelector from "react-native-switch-selector";
import { Box, Center, Heading, Text } from "@gluestack-ui/themed";
import { PlansMonthView } from "../components/plans-view/plans-month-view";
import { PlansViewOptions } from "../constants/constants";
import { PlanContextData, TextData } from "../types/types";
import { useAppSelector } from "../store/withTypes";
import { useTranslation } from "react-i18next";

interface ViewSwitchProps {
  onViewChange: (value: PlansViewOptions) => void;
}

const ViewSwitch = memo(({ onViewChange }: ViewSwitchProps) => {
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

interface GlobalGoalProps {
  text: string;
}

const GlobalGoal = memo(({ text }: GlobalGoalProps) => {
  const { t } = useTranslation();

  return (
    <Center pt="$5" pb="$5">
      <Text pb="$5">{t("screens.plansScreen.globalGoalTitle")}</Text>
      <Heading textAlign="center" size="sm">
        {text}
      </Heading>
    </Center>
  );
});

GlobalGoal.displayName = "GlobalGoal";

interface PlansViewProps {
  plans: PlanContextData;
  plansProps: ReturnType<typeof usePlansScreen>;
  viewType: PlansViewOptions;
}

const PlansView = memo(({ plans, plansProps, viewType }: PlansViewProps) => {
  const ViewComponent =
    viewType === PlansViewOptions.context ? PlansContextView : PlansMonthView;

  return <ViewComponent plans={plans} {...plansProps} />;
});

PlansView.displayName = "PlansView";

export function PlansScreen() {
  const [view, setView] = useState<PlansViewOptions>(PlansViewOptions.context);

  const { userData, status } = useAppSelector((state) => state.app);
  const plans = userData?.plans as PlanContextData | null;
  const globalGoal = userData?.goals as TextData | null;
  const isLoading = status === "pending";

  const plansProps = usePlansScreen({ plans });

  if (!plans && !globalGoal) {
    return <EmptyScreen />;
  }

  return (
    <>
      {isLoading && <Loader absolute />}
      {plans && <ViewSwitch onViewChange={setView} />}
      {globalGoal && <GlobalGoal text={globalGoal.text} />}
      {plans && (
        <PlansView plans={plans} plansProps={plansProps} viewType={view} />
      )}
    </>
  );
}
