import {
  TASK_CATEGORY,
  TASK_CONTEXT,
  TaskOutputType,
} from "../constants/tasks";
import { taskMonths } from "../constants/months";

export interface TextData {
  id: string;
  text: string;
}

export interface ImageData {
  id: string;
  uri?: string;
  width?: number;
  height?: number;
}

export interface TextImageData extends TextData {
  image: ImageData | null;
}

export interface GoalsData {
  globalGoal?: TextData | null;
  supportWord?: TextData | null;
}

export type TaskContext =
  | (typeof TASK_CONTEXT)[keyof typeof TASK_CONTEXT]
  | (typeof taskMonths)[number];

export type TaskGategory = (typeof TASK_CATEGORY)[keyof typeof TASK_CATEGORY];

export interface TaskProgress {
  totalTasks: number;
  doneTasks: number;
  donePercentage: number;
}

export interface DayTaskConfig {
  category: TaskGategory;
  grade: number;
  context?: TaskContext;
  taskOutputType: TaskOutputType;
  text: string;
  title: string;
}

export interface DayConfig {
  videoText: string;
  videoId: string;
  dayTaskConfig: DayTaskConfig;
  moodTaskConfig: DayTaskConfig;
}

export type MoodTaskData = { [day: string]: TextImageData | undefined };
export type MonthPhotoData = { [month: string]: TextImageData | undefined };

export interface DayTaskProgress {
  dayTaskGrade: number;
  moodTaskGrade: number;
}

export interface DayData {
  day: string;
  progress: DayTaskProgress;
  config: DayConfig;
}
