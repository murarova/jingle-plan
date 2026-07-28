import { Box } from "@/components/ui/box";
import { memo } from "react";
import { PlansContextView, PlansMonthView } from "../../components/plans-view";
import { PlansViewOptions } from "../../constants/constants";
import { usePlansScreen } from "../../components/plans-view/hooks/usePlansScreen";

interface PlansViewComponentProps {
  plansProps: ReturnType<typeof usePlansScreen>;
  viewType: PlansViewOptions;
}

export const PlansView = memo(
  ({ plansProps, viewType }: PlansViewComponentProps) => {
    const { contextEntries, monthlyPlans, ...handlers } = plansProps;

    return viewType === PlansViewOptions.context ? (
      <Box className="flex-1">
        <PlansContextView contextEntries={contextEntries} {...handlers} />
      </Box>
    ) : (
      <Box className="flex-1">
        <PlansMonthView monthlyPlans={monthlyPlans} {...handlers} />
      </Box>
    );
  }
);

PlansView.displayName = "PlansView";
