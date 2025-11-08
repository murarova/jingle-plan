import { PlanScreenData, TaskContext } from "../../../types/types";

export interface PlanWithContext extends PlanScreenData {
  context: TaskContext;
}

export type PlansMonthData = Record<string, PlanWithContext[]>;
