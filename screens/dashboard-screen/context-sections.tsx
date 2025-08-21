import { memo } from "react";
import { Box } from "@gluestack-ui/themed";
import { TASK_CONTEXT } from "../../constants/constants";
import { DashboardContextSection } from "./dashboard-context-section";
import { TaskContext, TaskProgress } from "../../types/types";

interface ContextSectionsProps {
  contextData: Partial<Record<TaskContext, TaskProgress>>;
}

export const ContextSections = memo(({ contextData }: ContextSectionsProps) => (
  <Box mt={10} flexWrap="wrap" flexDirection="row">
    {Object.values(TASK_CONTEXT).map((context) => {
      const data = contextData[context];
      if (!data) return null;

      return (
        <Box key={context} width="50%">
          <DashboardContextSection
            context={context}
            percentage={data.donePercentage}
            totalTasks={data.totalTasks}
            doneTasks={data.doneTasks}
          />
        </Box>
      );
    })}
  </Box>
));

ContextSections.displayName = "ContextSections";
