import { memo, useCallback } from "react";
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
import { useTranslation } from "react-i18next";
import { TASK_CONTEXT, PlansViewOptions } from "../../constants/constants";
import { PlansList } from "./components/plans";
import {
  PlanScreenData,
  PlansCollection,
  TaskContext,
} from "../../types/types";

export interface CompletePlanProps {
  plan: PlanScreenData;
  value: boolean;
  context: TaskContext;
  month?: string;
  view?: PlansViewOptions;
}

export interface PlansViewProps {
  plans: PlansCollection;
  handleEditPlan: (plan: PlanScreenData, context: TaskContext) => void;
  openMonthSelect: (plan: PlanScreenData, context: TaskContext) => void;
  handleDeletePlan: (id: string, context: TaskContext) => void;
  handleUpdatePlan: (id: string, text: string) => void;
  handleMonthSelect: (month: string) => void;
  handleCompletePlan: (props: CompletePlanProps) => void;
  setShowModal: (value: boolean) => void;
  showModal: boolean;
  updatedData: PlanScreenData | null;
}

interface AccordionHeaderContentProps {
  context: TaskContext;
  isExpanded: boolean;
  plansCount: number;
}

const AccordionHeaderContent = memo(
  ({ context, isExpanded, plansCount }: AccordionHeaderContentProps) => {
    const { t } = useTranslation();

    return (
      <>
        <AccordionTitleText>
          <Box flexDirection="row" alignItems="center">
            <Heading size="sm" mr="$2">
              {t(`context.${context}`)}
            </Heading>
            <Text>({plansCount})</Text>
          </Box>
        </AccordionTitleText>
        <AccordionIcon
          as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
          ml="$3"
        />
      </>
    );
  }
);

AccordionHeaderContent.displayName = "AccordionHeaderContent";

interface PlansAccordionContentProps {
  context: TaskContext;
  plans: PlanScreenData[];
  onMonthSelect: (item: PlanScreenData) => void;
  onEdit: (item: PlanScreenData) => void;
  onDelete: (item: PlanScreenData) => void;
  onComplete: (props: CompletePlanProps) => void;
}

const PlansAccordionContent = memo(
  ({
    plans,
    onMonthSelect,
    onEdit,
    onDelete,
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
          handleCompletePlan={onComplete}
        />
      </Box>
    </AccordionContent>
  )
);

PlansAccordionContent.displayName = "PlansAccordionContent";

export const PlansContextView = memo(
  ({
    plans,
    openMonthSelect,
    handleEditPlan,
    handleDeletePlan,
    handleCompletePlan,
  }: PlansViewProps) => {
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
            {Object.values(TASK_CONTEXT).map((context: TaskContext) => {
              const contextPlans = plans[context];
              if (!contextPlans) return null;

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
                          plansCount={contextPlans.length}
                        />
                      )}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <PlansAccordionContent
                    context={context}
                    plans={contextPlans}
                    onMonthSelect={(item) =>
                      handleMonthSelectForContext(item, context)
                    }
                    onEdit={(item) => handleEditForContext(item, context)}
                    onDelete={(item) => handleDeleteForContext(item, context)}
                    onComplete={(props) =>
                      handleCompleteForContext({
                        ...props,
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
