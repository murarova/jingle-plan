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
import { useEffect, useState } from "react";
import { TaskOutputType, TASK_CATEGORY } from "../constants/constants";
import { getUserDayTasks } from "../services/services";
import { Plans } from "./day-tasks/plans/plans";
import { Summary } from "./day-tasks/summary/summary";
import { MonthPhoto } from "./day-tasks/month-photo/month-photo";
import { Alert } from "react-native";
import { MoodTask } from "./day-tasks/mood/mood-task";
import { Goals } from "./day-tasks/goals/goals";
import { useAppDispatch } from "../store/withTypes";
import { updateDayProgressAsync } from "../services/auth-api";
import moment from "moment";
import {
  PlanData,
  SummaryData,
  DayTaskConfig,
  TextData,
  TextImageData,
  TaskContext,
} from "../types/types";

type UsersData = PlanData[] | SummaryData | TextImageData | TextData;

export function TaskItem({
  taskConfig,
  currentDay,
}: {
  taskConfig: DayTaskConfig;
  currentDay: string;
}) {
  const { t } = useTranslation();
  const [data, setData] = useState<UsersData | null>(null);
  const dispatch = useAppDispatch();
  const day = moment(currentDay).format("DD");
  const progressKey =
    taskConfig.category === TASK_CATEGORY.MOOD
      ? "moodTaskGrade"
      : "dayTaskGrade";

  function handleAddProgress() {
    dispatch(
      updateDayProgressAsync({
        day: currentDay,
        [progressKey]: taskConfig.grade,
      })
    );
  }

  function handleRemoveProgress() {
    dispatch(
      updateDayProgressAsync({
        day: currentDay,
        [progressKey]: 0,
      })
    );
  }

  useEffect(() => {
    async function getDayData() {
      try {
        const data = await getUserDayTasks(
          taskConfig.category,
          taskConfig.context
        );
        if (data) {
          taskConfig.category === TASK_CATEGORY.MOOD
            ? setData(data[day])
            : setData(data);
        }
      } catch (error) {
        Alert.alert("Oops", "Something wrong");
      }
    }
    getDayData();
  }, []);

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
                  data={data as PlanData[] | null}
                  setData={setData}
                  handleAddProgress={handleAddProgress}
                  handleRemoveProgress={handleRemoveProgress}
                />
              )}
              {taskConfig.taskOutputType === TaskOutputType.Text &&
                taskConfig.category === TASK_CATEGORY.SUMMARY && (
                  <Summary
                    context={taskConfig.context as TaskContext}
                    data={data as SummaryData | null}
                    setData={setData}
                    handleAddProgress={handleAddProgress}
                    handleRemoveProgress={handleRemoveProgress}
                  />
                )}
              {taskConfig.taskOutputType === TaskOutputType.Image &&
                taskConfig.category !== TASK_CATEGORY.MOOD && (
                  <MonthPhoto
                    data={data as TextImageData | null}
                    setData={setData}
                    context={taskConfig.context as TaskContext}
                    handleAddProgress={handleAddProgress}
                    handleRemoveProgress={handleRemoveProgress}
                  />
                )}
              {taskConfig.category === TASK_CATEGORY.MOOD && (
                <MoodTask
                  data={data as TextImageData | null}
                  taskOutputType={taskConfig.taskOutputType}
                  setData={setData}
                  day={day}
                  handleAddProgress={handleAddProgress}
                  handleRemoveProgress={handleRemoveProgress}
                />
              )}
              {taskConfig.category === TASK_CATEGORY.GOALS && (
                <Goals
                  data={data as TextData | null}
                  context={taskConfig.context as TaskContext}
                  setData={setData}
                  handleAddProgress={handleAddProgress}
                  handleRemoveProgress={handleRemoveProgress}
                />
              )}
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
