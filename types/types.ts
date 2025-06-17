import {
  TASK_CATEGORY,
  TASK_CONTEXT,
  TaskOutputType,
  albumScreenmMonthOrder,
  allMonths,
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

export type TaskContext =
  | (typeof TASK_CONTEXT)[keyof typeof TASK_CONTEXT]
  | (typeof allMonths)[number];

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

export type CalendarConfig = Record<string, Record<string, DayConfig>>;
export type MoodTaskData = { [day: string]: TextImageData | undefined };
export type MonthPhotoData = { [month: string]: TextImageData | undefined };
export type PlanContextData = { [context: string]: PlanData[] | undefined };
export type SummaryContextData = { [context: string]: SummaryData | undefined };
export type UserProfile = {
  name: string;
  isAdmin?: boolean;
};

export interface UserData {
  [TASK_CATEGORY.MOOD]?: MoodTaskData;
  [TASK_CATEGORY.SUMMARY]?: SummaryContextData | null;
  [TASK_CATEGORY.PLANS]?: PlanContextData | null;
  [TASK_CATEGORY.MONTH_PHOTO]?: MonthPhotoData | null;
  [TASK_CATEGORY.GOALS]?: TextData | null;
  userProfile: UserProfile;
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
