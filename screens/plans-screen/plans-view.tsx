import { Box } from "@/ui/box";
import { memo } from "react";
import { PlansContextView } from "./context-view/plans-context-view";
import { PlansMonthView } from "./month-view/plans-month-view";
import { PlansViewOptions } from "@/constants";
import { usePlansScreen } from "./hooks/usePlansScreen";

interface PlansViewComponentProps {
  plansProps: ReturnType<typeof usePlansScreen>;
  viewType: PlansViewOptions;
  searchExpandedKey: string;
}

export const PlansView = memo(
  ({ plansProps, viewType, searchExpandedKey }: PlansViewComponentProps) => {
    const { contextEntries, monthlyPlans, ...handlers } = plansProps;

    return viewType === PlansViewOptions.context ? (
      <Box className="flex-1">
        <PlansContextView
          contextEntries={contextEntries}
          searchExpandedKey={searchExpandedKey}
          {...handlers}
        />
      </Box>
    ) : (
      <Box className="flex-1">
        <PlansMonthView
          monthlyPlans={monthlyPlans}
          searchExpandedKey={searchExpandedKey}
          {...handlers}
        />
      </Box>
    );
  }
);

PlansView.displayName = "PlansView";
