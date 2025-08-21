import { memo } from "react";
import { PlansContextView } from "../../components/plans-view/plans-context-view";
import { PlansMonthView } from "../../components/plans-view/plans-month-view";
import { PlansViewOptions } from "../../constants/constants";
import { PlanContextData } from "../../types/types";
import { usePlansScreen } from "../../components/plans-view/hooks/usePlansScreen";

interface PlansViewProps {
  plans: PlanContextData;
  plansProps: ReturnType<typeof usePlansScreen>;
  viewType: PlansViewOptions;
}

export const PlansView = memo(
  ({ plans, plansProps, viewType }: PlansViewProps) => {
    const ViewComponent =
      viewType === PlansViewOptions.context ? PlansContextView : PlansMonthView;

    return <ViewComponent plans={plans} {...plansProps} />;
  }
);

PlansView.displayName = "PlansView";
