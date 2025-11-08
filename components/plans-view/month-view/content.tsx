import { memo } from "react";
import { AccordionContent, Box } from "@gluestack-ui/themed";
import { PlansList } from "../components/plans-list";
import { PlansViewOptions } from "../../../constants/constants";
import { CompletePlanProps } from "../context-view/types";
import { PlanWithContext } from "./types";

interface MonthPlansContentProps {
  plans: PlanWithContext[];
  onMonthSelect: (item: PlanWithContext) => void;
  onEdit: (item: PlanWithContext) => void;
  onDelete: (item: PlanWithContext) => void;
  onCopyToNextYear?: (item: PlanWithContext) => void;
  onComplete: (props: CompletePlanProps) => void;
  month: string;
}

export const MonthPlansContent = memo(
  ({
    plans,
    onMonthSelect,
    onEdit,
    onDelete,
    onCopyToNextYear,
    onComplete,
    month,
  }: MonthPlansContentProps) => (
    <AccordionContent>
      <Box>
        <PlansList
          view={PlansViewOptions.month}
          plans={plans}
          onMonthSelect={onMonthSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopyToNextYear={onCopyToNextYear}
          handleCompletePlan={onComplete}
          month={month}
        />
      </Box>
    </AccordionContent>
  )
);

MonthPlansContent.displayName = "PlansMonthContent";
