import { Box } from "@/ui/box";
import { AccordionContent } from "@/ui/accordion";
import { memo } from "react";
import { PlansViewOptions } from "@/constants";
import { PlansList } from "../components/plans-list";
import { PlanScreenData, TaskContext } from "@/types";
import { CompletePlanProps } from "./types";

interface PlansAccordionContentProps {
  context: TaskContext;
  plans: PlanScreenData[];
  onMonthSelect: (item: PlanScreenData) => void;
  onEdit: (item: PlanScreenData) => void;
  onDelete: (item: PlanScreenData) => void;
  onCopyToNextYear?: (item: PlanScreenData) => void;
  onComplete: (props: CompletePlanProps) => void;
}

export const PlansAccordionContent = memo(
  ({
    plans,
    onMonthSelect,
    onEdit,
    onDelete,
    onCopyToNextYear,
    onComplete,
  }: PlansAccordionContentProps) => (
    <AccordionContent className="mt-0 px-5 pb-5 pt-0">
      <Box>
        <PlansList
          plans={plans}
          onMonthSelect={onMonthSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopyToNextYear={onCopyToNextYear}
          handleCompletePlan={onComplete}
          view={PlansViewOptions.context}
        />
      </Box>
    </AccordionContent>
  )
);

PlansAccordionContent.displayName = "PlansContextAccordionContent";
