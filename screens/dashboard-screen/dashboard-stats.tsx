import { memo } from "react";
import { HStack, View } from "@gluestack-ui/themed";
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
    <HStack justifyContent="space-between" mt={20} pb="$4" px="$4">
      <View flex={1} alignItems="center" justifyContent="center">
        <ProgressStat
          value={totalData.totalTasks}
          label={getPluralForm(totalData.totalTasks, t)}
        />
      </View>
      <View flex={1} alignItems="center">
        <CircularProgressIndicator percentage={totalData.donePercentage} />
      </View>
      <View flex={1} alignItems="center" justifyContent="center">
        <ProgressStat
          value={totalData.doneTasks}
          label={t("screens.dashboardScreen.completed")}
        />
      </View>
    </HStack>
  );
});

DashboardStats.displayName = "DashboardStats";
