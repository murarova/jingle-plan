import { ScrollView } from "@/ui/scroll-view";
import { Box } from "@/ui/box";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { memo, useCallback } from "react";
import { months, PlansViewOptions, cardShadow } from "@/constants";
import { EmptyScreen } from "../../../components/common/empty-screen";
import isEmpty from "lodash/isEmpty";
import { AccordionHeaderContent } from "./header";
import { MonthPlansContent } from "./content";
import { CompletePlanProps, PlansMonthViewProps } from "../context-view/types";
import { PlanWithContext } from "./types";
import { useSearchExpanded } from "../hooks/use-search-expanded";

export const PlansMonthView = memo(
  ({
    monthlyPlans,
    handleEditPlan,
    handleDeletePlan,
    handleCopyToNextYear,
    handleCompletePlan,
    openMonthSelect,
    searchExpandedKey = "",
  }: PlansMonthViewProps) => {
    const handlePlanEdit = useCallback(
      (item: PlanWithContext) => {
        handleEditPlan(item, item.context);
      },
      [handleEditPlan],
    );

    const handlePlanDelete = useCallback(
      (item: PlanWithContext) => {
        handleDeletePlan(item.id, item.context);
      },
      [handleDeletePlan],
    );

    const handlePlanComplete = useCallback(
      (props: CompletePlanProps) => {
        handleCompletePlan(props);
      },
      [handleCompletePlan],
    );

    const handlePlanMonthSelect = useCallback(
      (item: PlanWithContext) => {
        openMonthSelect(item, item.context);
      },
      [openMonthSelect],
    );

    const handlePlanCopyToNextYear = useCallback(
      (item: PlanWithContext) => {
        handleCopyToNextYear(item, item.context);
      },
      [handleCopyToNextYear],
    );

    const firstMonth = months.find((month) => monthlyPlans[month.value]);
    const [expanded, setExpanded] = useSearchExpanded(
      firstMonth ? [firstMonth.value] : [],
      searchExpandedKey,
    );

    if (isEmpty(monthlyPlans)) {
      return <EmptyScreen />;
    }

    return (
      <ScrollView>
        <Box className="flex-1 px-4 pb-24">
          <Accordion
            key="month-view"
            type="multiple"
            value={expanded}
            onValueChange={setExpanded}
            className="bg-transparent"
          >
            {months.map((month) => {
              const monthPlans = monthlyPlans[month.value];
              if (!monthPlans) return null;

              return (
                <AccordionItem
                  key={month.value}
                  value={month.value}
                  className="mb-4 overflow-hidden rounded-3xl border border-ivory-line bg-ivory-card"
                  style={cardShadow}
                >
                  <AccordionHeader>
                    <AccordionTrigger className="px-5 py-5">
                      {({ isExpanded }: { isExpanded: boolean }) => (
                        <AccordionHeaderContent
                          monthName={month.long}
                          isExpanded={isExpanded}
                        />
                      )}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <MonthPlansContent
                    plans={monthPlans}
                    onMonthSelect={handlePlanMonthSelect}
                    onEdit={handlePlanEdit}
                    onDelete={handlePlanDelete}
                    onCopyToNextYear={handlePlanCopyToNextYear}
                    onComplete={(props) =>
                      handlePlanComplete({
                        ...props,
                        month: month.value,
                        view: PlansViewOptions.month,
                      })
                    }
                    month={month.value}
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

PlansMonthView.displayName = "PlansMonthView";
