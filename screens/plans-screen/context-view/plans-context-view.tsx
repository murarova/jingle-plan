import { ScrollView } from "@/ui/scroll-view";
import { Box } from "@/ui/box";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { memo, useCallback } from "react";
import { PlansViewOptions, cardShadow } from "@/constants";
import { PlanScreenData, TaskContext } from "@/types";
import { AccordionHeaderContent } from "./header";
import { PlansAccordionContent } from "./content";
import { CompletePlanProps, PlansContextViewProps } from "./types";
import { useSearchExpanded } from "../hooks/use-search-expanded";

export const PlansContextView = memo(
  ({
    contextEntries,
    openMonthSelect,
    handleEditPlan,
    handleDeletePlan,
    handleCopyToNextYear,
    handleCompletePlan,
    searchExpandedKey = "",
  }: PlansContextViewProps) => {
    const handleMonthSelectForContext = useCallback(
      (item: PlanScreenData, context: TaskContext) => {
        openMonthSelect(item, context);
      },
      [openMonthSelect],
    );

    const handleEditForContext = useCallback(
      (item: PlanScreenData, context: TaskContext) => {
        handleEditPlan(item, context);
      },
      [handleEditPlan],
    );

    const handleDeleteForContext = useCallback(
      (item: PlanScreenData, context: TaskContext) => {
        handleDeletePlan(item.id, context);
      },
      [handleDeletePlan],
    );

    const handleCompleteForContext = useCallback(
      (props: CompletePlanProps) => {
        handleCompletePlan(props);
      },
      [handleCompletePlan],
    );

    const [expanded, setExpanded] = useSearchExpanded(
      contextEntries[0] ? [contextEntries[0].context] : [],
      searchExpandedKey,
    );

    return (
      <ScrollView>
        <Box className="flex-1 px-4 pb-24">
          <Accordion
            key="context-view"
            type="multiple"
            value={expanded}
            onValueChange={setExpanded}
            className="bg-transparent"
          >
            {contextEntries.map(({ context, plans }) => {
              if (!plans?.length) return null;

              return (
                <AccordionItem
                  key={context}
                  value={context}
                  className="mb-4 overflow-hidden rounded-3xl border border-ivory-line bg-ivory-card"
                  style={cardShadow}
                >
                  <AccordionHeader>
                    <AccordionTrigger className="px-5 py-5">
                      {({ isExpanded }: { isExpanded: boolean }) => (
                        <AccordionHeaderContent
                          context={context}
                          isExpanded={isExpanded}
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
  },
);

PlansContextView.displayName = "PlansContextView";
