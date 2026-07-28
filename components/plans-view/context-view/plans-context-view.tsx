import { ScrollView } from "@/components/ui/scroll-view";
import { Box } from "@/components/ui/box";
import { Accordion, AccordionHeader, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { memo, useCallback } from "react";
import { PlansViewOptions } from "../../../constants/constants";
import { PlanScreenData, TaskContext } from "../../../types/types";
import { AccordionHeaderContent } from "./header";
import { PlansAccordionContent } from "./content";
import { CompletePlanProps, PlansContextViewProps } from "./types";

export const PlansContextView = memo(
  ({
    contextEntries,
    openMonthSelect,
    handleEditPlan,
    handleDeletePlan,
    handleCopyToNextYear,
    handleCompletePlan,
  }: PlansContextViewProps) => {
    const handleMonthSelectForContext = useCallback(
      (item: PlanScreenData, context: TaskContext) => {
        openMonthSelect(item, context);
      },
      [openMonthSelect]
    );

    const handleEditForContext = useCallback(
      (item: PlanScreenData, context: TaskContext) => {
        handleEditPlan(item, context);
      },
      [handleEditPlan]
    );

    const handleDeleteForContext = useCallback(
      (item: PlanScreenData, context: TaskContext) => {
        handleDeletePlan(item.id, context);
      },
      [handleDeletePlan]
    );

    const handleCompleteForContext = useCallback(
      (props: CompletePlanProps) => {
        handleCompletePlan(props);
      },
      [handleCompletePlan]
    );

    return (
      <ScrollView>
        <Box className="p-2 flex-1">
          <Accordion key="context-view" type="multiple" className="my-2 rounded-lg">
            {contextEntries.map(({ context, plans }) => {
              if (!plans?.length) return null;

              return (
                <AccordionItem key={context} value={context} className="rounded-lg mb-5">
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }: { isExpanded: boolean }) => (
                        <AccordionHeaderContent
                          context={context}
                          isExpanded={isExpanded}
                          plansCount={plans.length}
                        />
                      )}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <PlansAccordionContent
                    context={context}
                    plans={plans}
                    onMonthSelect={(item) =>
                      handleMonthSelectForContext(item, context)
                    }
                    onEdit={(item) => handleEditForContext(item, context)}
                    onDelete={(item) => handleDeleteForContext(item, context)}
                    onCopyToNextYear={(item) =>
                      handleCopyToNextYear(item, context)
                    }
                    onComplete={(props) =>
                      handleCompleteForContext({
                        ...props,
                        context,
                        view: PlansViewOptions.context,
                      })
                    }
                  />
                </AccordionItem>
              );
            })}
          </Accordion>
        </Box>
      </ScrollView>
    );
  }
);

PlansContextView.displayName = "PlansContextView";
