import { memo } from "react";
import { PlansContextView, PlansMonthView } from "../../components/plans-view";
import { PlansViewOptions } from "../../constants/constants";
import { usePlansScreen } from "../../components/plans-view/hooks/usePlansScreen";
import { Box } from "@gluestack-ui/themed";

interface PlansViewComponentProps {
  plansProps: ReturnType<typeof usePlansScreen>;
  viewType: PlansViewOptions;
}

export const PlansView = memo(
  ({ plansProps, viewType }: PlansViewComponentProps) => {
    const { contextEntries, monthlyPlans, ...handlers } = plansProps;

    return (
      <>
        <Box
          flex={1}
          display={viewType === PlansViewOptions.context ? "flex" : "none"}
        >
          <PlansContextView contextEntries={contextEntries} {...handlers} />
        </Box>
        <Box
          flex={1}
          display={viewType === PlansViewOptions.month ? "flex" : "none"}
        >
          <PlansMonthView monthlyPlans={monthlyPlans} {...handlers} />
        </Box>
      </>
    );
  }
);

PlansView.displayName = "PlansView";
