import { Box } from "@/ui/box";
import { AccordionContent } from "@/ui/accordion";
import { memo } from "react";
import { PlansViewOptions } from "@/constants";
import { PlansList } from "../components/plans-list";
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
    <AccordionContent className="mt-0 px-5 pb-5 pt-0">
      <Box>
        <PlansList
          plans={plans}
          onMonthSelect={onMonthSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopyToNextYear={onCopyToNextYear}
          handleCompletePlan={onComplete}
          month={month}
          view={PlansViewOptions.month}
        />
      </Box>
    </AccordionContent>
  )
);

MonthPlansContent.displayName = "PlansMonthContent";
