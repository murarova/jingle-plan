import { memo } from "react";
import { AccordionContent, Box } from "@gluestack-ui/themed";
import { PlansList } from "../components/plans-list";
import { PlanScreenData, TaskContext } from "../../../types/types";
import { PlansViewOptions } from "../../../constants/constants";
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
    <AccordionContent>
      <Box>
        <PlansList
          view={PlansViewOptions.context}
          plans={plans}
          onMonthSelect={onMonthSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopyToNextYear={onCopyToNextYear}
          handleCompletePlan={onComplete}
        />
      </Box>
    </AccordionContent>
  )
);

PlansAccordionContent.displayName = "PlansContextAccordionContent";
