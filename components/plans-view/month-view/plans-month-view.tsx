import { memo, useCallback } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  Box,
  ScrollView,
} from "@gluestack-ui/themed";
import { months, PlansViewOptions } from "../../../constants/constants";
import { EmptyScreen } from "../../empty-screen";
import isEmpty from "lodash/isEmpty";
import { AccordionHeaderContent } from "./header";
import { MonthPlansContent } from "./content";
import { CompletePlanProps, PlansMonthViewProps } from "../context-view/types";
import { PlanWithContext } from "./types";

export const PlansMonthView = memo(
  ({
    monthlyPlans,
    handleEditPlan,
    handleDeletePlan,
    handleCopyToNextYear,
    handleCompletePlan,
    openMonthSelect,
  }: PlansMonthViewProps) => {
    const handlePlanEdit = useCallback(
      (item: PlanWithContext) => {
        handleEditPlan(item, item.context);
      },
      [handleEditPlan]
    );

    const handlePlanDelete = useCallback(
      (item: PlanWithContext) => {
        handleDeletePlan(item.id, item.context);
      },
      [handleDeletePlan]
    );

    const handlePlanComplete = useCallback(
      (props: CompletePlanProps) => {
        handleCompletePlan(props);
      },
      [handleCompletePlan]
    );

    const handlePlanMonthSelect = useCallback(
      (item: PlanWithContext) => {
        openMonthSelect(item, item.context);
      },
      [openMonthSelect]
    );

    const handlePlanCopyToNextYear = useCallback(
      (item: PlanWithContext) => {
        handleCopyToNextYear(item, item.context);
      },
      [handleCopyToNextYear]
    );

    if (isEmpty(monthlyPlans)) {
      return <EmptyScreen />;
    }

    return (
      <ScrollView>
        <Box p="$2" flex={1}>
          <Accordion
            key="month-view"
            size="md"
            my="$2"
            type="multiple"
            borderRadius="$lg"
          >
            {months.map((month) => {
              const monthPlans = monthlyPlans[month.value];
              if (!monthPlans) return null;

              return (
                <AccordionItem
                  key={month.value}
                  value={month.value}
                  borderRadius="$lg"
                  mb="$5"
                >
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }) => (
                        <AccordionHeaderContent
                          monthName={month.long}
                          plansCount={monthPlans.length}
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
  }
);

PlansMonthView.displayName = "PlansMonthView";
