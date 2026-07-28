import { ScrollView } from "@/components/ui/scroll-view";
import { Box } from "@/components/ui/box";
import { memo } from "react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { EmptyScreen } from "../../components/empty-screen";
import { DashboardStats } from "./dashboard-stats";
import { ContextSections } from "./context-sections";

export const DashboardScreen = memo(() => {
  const { totalData, contextData, isEmpty, isLoading } = useDashboardData();

  if (isEmpty) {
    return <EmptyScreen />;
  }

  return (
    <Box className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, padding: 8 }}
      >
        {totalData && <DashboardStats totalData={totalData} />}
        {contextData && <ContextSections contextData={contextData} />}
      </ScrollView>
    </Box>
  );
});

DashboardScreen.displayName = "DashboardScreen";
