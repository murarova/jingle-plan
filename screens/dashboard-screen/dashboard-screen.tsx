import { memo, useRef } from "react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { EmptyScreen } from "../../components/empty-screen";
import { SafeAreaView, ScrollView, Box } from "@gluestack-ui/themed";
import { Loader } from "../../components/common";
import { DashboardStats } from "./dashboard-stats";
import { ContextSections } from "./context-sections";

export const DashboardScreen = memo(() => {
  const { totalData, contextData, isEmpty, status } = useDashboardData();

  if (isEmpty) {
    return <EmptyScreen />;
  }

  return (
    <SafeAreaView flex={1}>
      <Box p="$2">
        {status === "pending" && <Loader absolute />}
        {totalData && <DashboardStats totalData={totalData} />}
        <ScrollView>
          {contextData && <ContextSections contextData={contextData} />}
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
});

DashboardScreen.displayName = "DashboardScreen";
