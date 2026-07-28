import { TASK_CATEGORY } from "../constants/tasks";
import { GoalsData, MoodTaskData, MonthPhotoData } from "./task";
import { PlanContextData, SummaryContextData } from "./plan";

export type UserProfile = {
  name: string;
  isAdmin?: boolean;
};

export interface UserData {
  [TASK_CATEGORY.MOOD]?: MoodTaskData;
  [TASK_CATEGORY.SUMMARY]?: SummaryContextData | null;
  [TASK_CATEGORY.PLANS]?: PlanContextData | null;
  [TASK_CATEGORY.MONTH_PHOTO]?: MonthPhotoData | null;
  [TASK_CATEGORY.GOALS]?: GoalsData | null;
  userProfile: UserProfile;
}
