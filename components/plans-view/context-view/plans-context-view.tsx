import { memo, useCallback } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  Box,
  ScrollView,
} from "@gluestack-ui/themed";
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
        <Box p="$2" flex={1}>
          <Accordion
            key="context-view"
            size="md"
            my="$2"
            type="multiple"
            borderRadius="$lg"
          >
            {contextEntries.map(({ context, plans }) => {
              if (!plans?.length) return null;

              return (
                <AccordionItem
                  key={context}
                  value={context}
                  borderRadius="$lg"
                  mb="$5"
                >
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }) => (
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
