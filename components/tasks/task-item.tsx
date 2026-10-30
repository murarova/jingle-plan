import { Heading } from "@/ui/heading";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";

import { TaskOutputType, TASK_CATEGORY } from "@/constants";
import { Plans } from "../day-tasks/plans/plans";
import { Summary } from "../day-tasks/summary/summary";
import { MonthPhoto } from "../day-tasks/month-photo/month-photo";
import { Goals } from "../day-tasks/goals/goals";
import moment from "moment";
import {
  DayTaskConfig,
  TaskContext,
  MoodTaskData,
  MonthPhotoData,
  PlanContextData,
  SummaryContextData,
  GoalsData,
  UserData,
} from "@/types";
import { MoodTask } from "../day-tasks/mood/mood-task";

export function TaskItem({
  taskConfig,
  currentDay,
  userData,
}: {
  taskConfig: DayTaskConfig;
  currentDay: string;
  userData?: UserData | null;
}) {
  const day = moment(currentDay).format("DD");

  return (
    <Box className="gap-5 rounded-[28px] border border-ivory-line bg-ivory-card p-6">
      <Box className="gap-4">
        <Box className="gap-2">
          <Heading size="sm">{taskConfig.title}</Heading>
          <Text>{taskConfig.text}</Text>
        </Box>
        <Box>
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
                  (userData?.[taskConfig.category] as MonthPhotoData) ?? null
                }
                context={taskConfig.context as TaskContext}
              />
            )}
          {taskConfig.category === TASK_CATEGORY.MOOD && (
            <MoodTask
              data={(userData?.[taskConfig.category] as MoodTaskData) ?? null}
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
      </Box>
    </Box>
  );
}
