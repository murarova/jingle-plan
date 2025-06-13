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
import { AddPlanModal } from "../day-tasks/plans/add-plan-modal";
import { MonthSelectModal } from "../modals/month-select-modal";
import { EmptyScreen } from "../empty-screen";
import isEmpty from "lodash/isEmpty";
import { PlansViewProps } from "./plans-context-view";
import {
  PlanScreenData,
  PlansCollection,
  TaskContext,
} from "../../types/types";

export function PlansMonthView({
  plans,
  handleEditPlan,
  handleDeletePlan,
  handleComplitePlan,
  showModal,
  updatedData,
  setShowModal,
  handleUpdatePlan,
  showMonthModal,
  setShowMonthModal,
  handleMonthSelect,
  openMonthSelect,
}: PlansViewProps) {
  function groupByMonthWithContext(
    plans: PlansCollection
  ): Record<string, (PlanScreenData & { context: TaskContext })[]> {
    const result: Record<
      string,
      (PlanScreenData & { context: TaskContext })[]
    > = {};

    for (const context in plans) {
      plans[context as TaskContext]?.forEach((item: PlanScreenData) => {
        const month = item.month as string;
        const itemWithContext = { ...item, context: context as TaskContext };

        if (month === "every") {
          // Add the plan to every month from January to December
          allMonths.forEach((monthName) => {
            if (!result[monthName]) {
              result[monthName] = [];
            }
            result[monthName].push(itemWithContext);
          });
        } else {
          // Normal case for a specific month
          if (!result[month]) {
            result[month] = [];
          }
          result[month].push(itemWithContext);
        }
      });
    }

    return result;
  }

  const sortedPlans = groupByMonthWithContext(plans);

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
            return (
              sortedPlans[month.value] && (
                <AccordionItem
                  key={month.value}
                  value={month.value}
                  borderRadius="$lg"
                  mb="$5"
                >
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }) => {
                        return (
                          <>
                            <AccordionTitleText>
                              <Heading size="sm">{month.long}</Heading>
                              <Text>{`  (${
                                sortedPlans[month.value].length
                              })`}</Text>
                            </AccordionTitleText>
                            {isExpanded ? (
                              <AccordionIcon as={ChevronUpIcon} ml="$3" />
                            ) : (
                              <AccordionIcon as={ChevronDownIcon} ml="$3" />
                            )}
                          </>
                        );
                      }}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>
                    <Box>
                      <PlansList
                        view={PlansViewOptions.month}
                        plans={sortedPlans[month.value]}
                        onMonthSelect={(item) => {
                          openMonthSelect(item, item.context);
                        }}
                        onEdit={(item) => handleEditPlan(item, item.context)}
                        onDelete={(item) =>
                          handleDeletePlan(item.id, item.context)
                        }
                        handleComplitePlan={(item, value) =>
                          handleComplitePlan(item, value, item.context)
                        }
                      />
                    </Box>
                  </AccordionContent>
                </AccordionItem>
              )
            );
          })}
        </Accordion>
        {showModal && (
          <AddPlanModal
            data={updatedData}
            setShowModal={setShowModal}
            handleUpdatePlan={handleUpdatePlan}
          />
        )}
        {showMonthModal && (
          <MonthSelectModal
            setShowMonthModal={setShowMonthModal}
            onMonthSelect={handleMonthSelect}
          />
        )}
      </Box>
    </ScrollView>
  );
}
