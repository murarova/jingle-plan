import { memo } from "react";
import { EmptyScreen } from "../components/empty-screen";
import { Loader } from "../components/common";
import {
  Box,
  SafeAreaView,
  HStack,
  Text,
  VStack,
  ScrollView,
} from "@gluestack-ui/themed";
import CircularProgress from "react-native-circular-progress-indicator";
import { config } from "../config/gluestack-ui.config";
import { TASK_CONTEXT } from "../constants/constants";
import { DashboardContextSection } from "../components/dashboard-context-section";
import { TaskContext, TaskProgress } from "../types/types";
import { useTranslation } from "react-i18next";
import { useDashboardData } from "../hooks/useDashboardData";

interface ProgressStatProps {
  value: number;
  label: string;
}

const ProgressStat = memo(({ value, label }: ProgressStatProps) => (
  <VStack justifyContent="center" alignItems="center">
    <Text size="xl" color={config.tokens.colors.warmGray900} fontWeight="bold">
      {value}
    </Text>
    <Text color={config.tokens.colors.warmGray400}>{label}</Text>
  </VStack>
));

ProgressStat.displayName = "ProgressStat";

interface CircularProgressIndicatorProps {
  percentage: number;
}

const CircularProgressIndicator = memo(
  ({ percentage }: CircularProgressIndicatorProps) => (
    <CircularProgress
      value={percentage}
      progressValueColor={config.tokens.colors.warmGray800}
      activeStrokeColor={config.tokens.colors.green400}
      inActiveStrokeColor={config.tokens.colors.warmGray400}
      inActiveStrokeOpacity={0.2}
      valueSuffix="%"
      radius={35}
      duration={1000}
      maxValue={100}
    />
  )
);

CircularProgressIndicator.displayName = "CircularProgressIndicator";

interface ContextSectionsProps {
  contextData: Partial<Record<TaskContext, TaskProgress>>;
}

const ContextSections = memo(({ contextData }: ContextSectionsProps) => (
  <Box mt={20} flexWrap="wrap" flexDirection="row">
    {Object.values(TASK_CONTEXT).map((context) => {
      const data = contextData[context];
      if (!data) return null;

      return (
        <Box key={context} width="50%">
          <DashboardContextSection
            context={context}
            percentage={data.donePercentage}
          />
        </Box>
      );
    })}
  </Box>
));

ContextSections.displayName = "ContextSections";

interface DashboardStatsProps {
  totalData: TaskProgress;
}

const DashboardStats = memo(({ totalData }: DashboardStatsProps) => {
  const { t } = useTranslation();

  return (
    <HStack justifyContent="space-around" mt={20} pb="$4">
      <ProgressStat
        value={totalData.totalTasks}
        label={t("screens.dashboardScreen.goals")}
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

export const DashboardScreen = memo(() => {
  const { totalData, contextData, isEmpty, status } = useDashboardData();

  if (isEmpty) {
    return <EmptyScreen />;
  }

  return (
    <SafeAreaView flex={1}>
      {status === "pending" && <Loader absolute />}
      {totalData && <DashboardStats totalData={totalData} />}
      <ScrollView>
        {contextData && <ContextSections contextData={contextData} />}
      </ScrollView>
    </SafeAreaView>
  );
});

DashboardScreen.displayName = "DashboardScreen";
