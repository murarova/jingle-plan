import { HStack } from "@/ui/hstack";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TaskProgress } from "@/types";
import { ProgressStat } from "./progress-stat";
import { CircularProgressIndicator } from "./circular-progress-indicator";
import { getPluralForm } from "@/utils";

interface DashboardStatsProps {
  totalData: TaskProgress;
}

export const DashboardStats = memo(({ totalData }: DashboardStatsProps) => {
  const { t } = useTranslation();

  return (
    <HStack className="h-[204px] items-center justify-between rounded-3xl border border-ivory-line bg-ivory-card px-3">
      <ProgressStat
        value={totalData.totalTasks}
        label={getPluralForm(totalData.totalTasks, t)}
      />
      <CircularProgressIndicator percentage={totalData.donePercentage} />
      <ProgressStat
        value={totalData.doneTasks}
        label={t("screens.dashboardScreen.completed")}
      />
    </HStack>
  );
});

DashboardStats.displayName = "DashboardStats";
