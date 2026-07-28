import { View } from "@/ui/view";
import { HStack } from "@/ui/hstack";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TaskProgress } from "../../types/types";
import { ProgressStat } from "./progress-stat";
import { CircularProgressIndicator } from "./circular-progress-indicator";
import { getPluralForm } from "../../utils/utils";

interface DashboardStatsProps {
  totalData: TaskProgress;
}

export const DashboardStats = memo(({ totalData }: DashboardStatsProps) => {
  const { t } = useTranslation();

  return (
    <HStack className="justify-between mt-[20px] pb-4 px-4">
      <View className="flex-1 items-center justify-center">
        <ProgressStat
          value={totalData.totalTasks}
          label={getPluralForm(totalData.totalTasks, t)}
        />
      </View>
      <View className="flex-1 items-center">
        <CircularProgressIndicator percentage={totalData.donePercentage} />
      </View>
      <View className="flex-1 items-center justify-center">
        <ProgressStat
          value={totalData.doneTasks}
          label={t("screens.dashboardScreen.completed")}
        />
      </View>
    </HStack>
  );
});

DashboardStats.displayName = "DashboardStats";
