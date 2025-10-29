import { memo, useCallback, useMemo } from "react";
import {
  Box,
  Text,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
  ChevronUpIcon,
  ChevronDownIcon,
  Heading,
  ScrollView,
} from "@gluestack-ui/themed";
import { allMonths, months, PlansViewOptions } from "../../constants/constants";
import { PlansList } from "./components/plans";
import { EmptyScreen } from "../empty-screen";
import isEmpty from "lodash/isEmpty";
import { CompletePlanProps, PlansViewProps } from "./plans-context-view";
import {
  PlanScreenData,
  PlansCollection,
  TaskContext,
} from "../../types/types";

interface PlanWithContext extends PlanScreenData {
  context: TaskContext;
}

type MonthlyPlans = Record<string, PlanWithContext[]>;

interface AccordionHeaderContentProps {
  monthName: string;
  plansCount: number;
  isExpanded: boolean;
}

const AccordionHeaderContent = memo(
  ({ monthName, plansCount, isExpanded }: AccordionHeaderContentProps) => (
    <>
      <AccordionTitleText>
        <Box flexDirection="row" alignItems="center">
          <Heading size="sm" mr="$2">
            {monthName}
          </Heading>
          <Text>({plansCount})</Text>
        </Box>
      </AccordionTitleText>
      <AccordionIcon
        as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
        ml="$3"
      />
    </>
  )
);

AccordionHeaderContent.displayName = "AccordionHeaderContent";

interface MonthPlansContentProps {
  plans: PlanWithContext[];
  onMonthSelect: (item: PlanWithContext) => void;
  onEdit: (item: PlanWithContext) => void;
  onDelete: (item: PlanWithContext) => void;
  onCopyToNextYear?: (item: PlanWithContext) => void;
  onComplete: (props: CompletePlanProps) => void;
  month: string;
}

const MonthPlansContent = memo(
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

MonthPlansContent.displayName = "MonthPlansContent";

const groupPlansByMonth = (plans: PlansCollection): MonthlyPlans => {
  const result: MonthlyPlans = {};

  Object.entries(plans).forEach(([context, contextPlans]) => {
    contextPlans?.forEach((item) => {
      const itemWithContext: PlanWithContext = {
        ...item,
        context: context as TaskContext,
      };

      if (item.month === "every") {
        // Add the plan to every month
        item.monthlyProgress?.forEach((month) => {
          result[month.month] = result[month.month] || [];
          result[month.month].push(itemWithContext);
        });
      } else if (item.month) {
        // Add plan to specific month
        result[item.month] = result[item.month] || [];
        result[item.month].push(itemWithContext);
      }
    });
  });
  return result;
};

export const PlansMonthView = memo(
  ({
    plans,
    handleEditPlan,
    handleDeletePlan,
    handleCopyToNextYear,
    handleCompletePlan,
    openMonthSelect,
  }: PlansViewProps) => {
    const sortedPlans = useMemo(() => groupPlansByMonth(plans), [plans]);

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

    if (isEmpty(sortedPlans)) {
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
              const monthPlans = sortedPlans[month.value];
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
