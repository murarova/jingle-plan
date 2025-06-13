import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
  ChevronUpIcon,
  ChevronDownIcon,
  Box,
  Text,
  Heading,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { TaskOutputType, TASK_CATEGORY } from "../constants/constants";
import { Plans } from "./day-tasks/plans/plans";
import { Summary } from "./day-tasks/summary/summary";
import { MonthPhoto } from "./day-tasks/month-photo/month-photo";
import { Goals } from "./day-tasks/goals/goals";
import { useAppDispatch, useAppSelector } from "../store/withTypes";
import moment from "moment";
import {
  PlanData,
  SummaryData,
  DayTaskConfig,
  TextData,
  TextImageData,
  TaskContext,
  MoodTaskData,
  MonthPhotoData,
  PlanContextData,
  SummaryContextData,
} from "../types/types";
import { MoodTask } from "./day-tasks/mood/mood-task";

type UsersData = PlanData[] | SummaryData | TextImageData | TextData;

export function TaskItem({
  taskConfig,
  currentDay,
}: {
  taskConfig: DayTaskConfig;
  currentDay: string;
}) {
  const { t } = useTranslation();
  const { userData } = useAppSelector((state) => state.app);
  const day = moment(currentDay).format("DD");

  return (
    <>
      <Accordion size="md" my="$2" type="multiple" borderRadius="$lg">
        <AccordionItem value="a" borderRadius="$lg">
          <AccordionHeader>
            <AccordionTrigger>
              {({ isExpanded }) => {
                return (
                  <>
                    <AccordionTitleText>
                      {taskConfig.category === TASK_CATEGORY.MOOD
                        ? t("screens.tasksOfTheDay.moodTitle")
                        : t("screens.tasksOfTheDay.dayTitle")}
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
              <Heading size="sm" pb="$2">
                {taskConfig.title}
              </Heading>
              <Text>{taskConfig.text}</Text>
            </Box>
            <Box pt="$4">
              {taskConfig.taskOutputType === TaskOutputType.List && (
                <Plans
                  context={taskConfig.context as TaskContext}
                  data={
                    (userData?.[taskConfig.category] as PlanContextData) ?? null
                  }
                />
              )}
              {taskConfig.taskOutputType === TaskOutputType.Text &&
                taskConfig.category === TASK_CATEGORY.SUMMARY && (
                  <Summary
                    context={taskConfig.context as TaskContext}
                    data={
                      (userData?.[taskConfig.category] as SummaryContextData) ??
                      null
                    }
                  />
                )}
              {taskConfig.taskOutputType === TaskOutputType.Image &&
                taskConfig.category !== TASK_CATEGORY.MOOD && (
                  <MonthPhoto
                    data={
                      (userData?.[taskConfig.category] as MonthPhotoData) ??
                      null
                    }
                    context={taskConfig.context as TaskContext}
                  />
                )}
              {taskConfig.category === TASK_CATEGORY.MOOD && (
                <MoodTask
                  data={
                    (userData?.[taskConfig.category] as MoodTaskData) ?? null
                  }
                  taskOutputType={taskConfig.taskOutputType}
                  day={day}
                />
              )}
              {taskConfig.category === TASK_CATEGORY.GOALS && (
                <Goals
                  data={(userData?.[taskConfig.category] as TextData) ?? null}
                  context={taskConfig.context as TaskContext}
                />
              )}
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
