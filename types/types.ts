import {
  TASK_CATEGORY,
  TASK_CONTEXT,
  TaskOutputType,
  albumScreenmMonthOrder,
} from "../constants/constants";

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

export type AlbumScreenMonth = (typeof albumScreenmMonthOrder)[number];

export interface MonthlyData extends TextImageData {
  month: AlbumScreenMonth;
}

export type MonthlyTasks = Record<AlbumScreenMonth, TextImageData>;

export interface SummaryData extends TextData {
  rate: number;
}

export interface PlanData extends TextData {
  isDone: boolean;
  month?: string;
}

export interface PlanScreenData extends PlanData {
  context: TaskContext;
}

export type TaskContext = (typeof TASK_CONTEXT)[keyof typeof TASK_CONTEXT];

export type PlansCollection = {
  [key in TaskContext]?: PlanScreenData[];
};

export type SummaryCollection = {
  [key in TaskContext]?: PlanScreenData[];
};

export type TaskGategory = (typeof TASK_CATEGORY)[keyof typeof TASK_CATEGORY];

export interface TaskProgress {
  totalTasks: number;
  doneTasks: number;
  donePercentage: number;
}

export interface DayTaskConfig {
  category: string;
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

export type CalendarConfig = Record<string, Record<string, DayConfig>>;

export interface UserData {
  [key: string]: {
    [key: string]: any;
  };
}

export interface DayTaskProgress {
  dayTaskGrade: number;
  moodTaskGrade: number;
}

export interface DayData {
  day: string;
  progress: DayTaskProgress;
  config: DayConfig;
}
