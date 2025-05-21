import moment, { Moment } from "moment";
import { TASK_CATEGORY } from "../constants/constants";
import { UserData, DayTaskConfig, DayConfig } from "../types/types";

interface TaskProgress {
  dayTaskGrade: number;
  moodTaskGrade: number;
}

interface DayData {
  day: string;
  progress: TaskProgress;
  config: DayConfig;
}

function getTaskGrade(
  config: DayTaskConfig,
  userData: UserData | null,
  day: string
): number {
  const { category, grade, context } = config;
  const completedTask =
    category === TASK_CATEGORY.MOOD
      ? userData?.[category]?.[day]
      : userData?.[category]?.[context!];

  return completedTask ? grade : 0;
}

export const enumerateDaysBetweenDates = (
  userData: UserData | null,
  taskConfig: Record<string, Record<string, DayConfig>>,
  language: string,
  startDate: Moment,
  endDate: Moment
): DayData[] => {
  const dates: DayData[] = [];
  let currDate = moment(startDate).startOf("hour");
  const lastDate = moment(endDate).startOf("hour");

  while (currDate.isSameOrBefore(lastDate)) {
    const day = currDate.format("DD");
    const dayConfig = taskConfig?.[day]?.[language];

    if (dayConfig) {
      const dayTaskGrade = getTaskGrade(dayConfig.dayTaskConfig, userData, day);
      const moodTaskGrade = getTaskGrade(
        dayConfig.moodTaskConfig,
        userData,
        day
      );

      dates.push({
        day: currDate.format("YYYY-MM-DD"),
        progress: {
          dayTaskGrade,
          moodTaskGrade,
        },
        config: dayConfig,
      });
    }

    currDate.add(1, "days");
  }

  return dates;
};

export function getProgressColorByValue(value: number): string {
  if (value < 30) {
    return "$progressRed";
  } else if (value >= 30 && value < 70) {
    return "$progressYellow";
  } else {
    return "$green400";
  }
}

export function calculateTotalProgress(progress?: TaskProgress): number {
  if (!progress) {
    return 0;
  }
  const totalProgress = Object.values(progress).reduce((sum, grade) => {
    return sum + grade;
  }, 0);

  return totalProgress;
}
