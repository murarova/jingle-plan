import { PlanScreenData, TaskContext } from "../../../types/types";
import { PlansViewOptions } from "../../../constants/constants";
import { PlansMonthData } from "../month-view/types";

export interface CompletePlanProps {
  plan: PlanScreenData;
  value: boolean;
  context: TaskContext;
  month?: string;
  view?: PlansViewOptions;
}

export interface PlansHandlers {
  handleEditPlan: (plan: PlanScreenData, context: TaskContext) => void;
  openMonthSelect: (plan: PlanScreenData, context: TaskContext) => void;
  handleDeletePlan: (id: string, context: TaskContext) => void;
  handleUpdatePlan: (id: string, text: string) => void;
  handleMonthSelect: (month: string) => void;
  handleCopyToNextYear: (plan: PlanScreenData, context: TaskContext) => void;
  handleCompletePlan: (props: CompletePlanProps) => void;
  setShowModal: (value: boolean) => void;
  showModal: boolean;
  updatedData: PlanScreenData | null;
}

export interface PlansContextEntry {
  context: TaskContext;
  plans: PlanScreenData[];
}

export interface PlansContextViewProps extends PlansHandlers {
  contextEntries: PlansContextEntry[];
}

export interface PlansMonthViewProps extends PlansHandlers {
  monthlyPlans: PlansMonthData;
}

