import { Heading } from "@/ui/heading";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { ChevronUpIcon, ChevronDownIcon } from "@/ui/icon";

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
} from "@/ui/accordion";

import { useTranslation } from "react-i18next";
import { TaskOutputType, TASK_CATEGORY } from "../../constants/constants";
import { Plans } from "../day-tasks/plans/plans";
import { Summary } from "../day-tasks/summary/summary";
import { MonthPhoto } from "../day-tasks/month-photo/month-photo";
import { Goals } from "../day-tasks/goals/goals";
import { useAppSelector } from "../../store/withTypes";
import moment from "moment";
import {
  DayTaskConfig,
  TaskContext,
  MoodTaskData,
  MonthPhotoData,
  PlanContextData,
  SummaryContextData,
  GoalsData,
} from "../../types/types";
import { MoodTask } from "../day-tasks/mood/mood-task";
import { useGetUserDataQuery } from "../../services/api";
import { useRef } from "react";
import { View } from "react-native";

export function TaskItem({
  taskConfig,
  currentDay,
}: {
  taskConfig: DayTaskConfig;
  currentDay: string;
}) {
  const { t } = useTranslation();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { selectedYear } = useAppSelector((state) => state.app);
  const { data: userData } = useGetUserDataQuery(
    { uid: currentUser?.uid!, year: selectedYear },
    { skip: !currentUser?.uid || !selectedYear }
  );
  const day = moment(currentDay).format("DD");
  const accordionHeaderRef = useRef<View>(null);

  return (
    <>
      <Accordion type="multiple" className="my-2 rounded-lg">
        <AccordionItem value="a" className="rounded-lg">
          <View ref={accordionHeaderRef}>
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }: { isExpanded: boolean }) => {
                  return (
                    <>
                      <AccordionTitleText>
                        {taskConfig.category === TASK_CATEGORY.MOOD
                          ? t("screens.tasksOfTheDay.moodTitle")
                          : t("screens.tasksOfTheDay.dayTitle")}
                      </AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                      ) : (
                        <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
          </View>
          <AccordionContent>
            <Box>
              <Heading size="sm" className="pb-2">
                {taskConfig.title}
              </Heading>
              <Text>{taskConfig.text}</Text>
            </Box>
            <Box className="pt-4">
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
                  data={(userData?.[taskConfig.category] as GoalsData) ?? null}
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
