import { Box } from "@/ui/box";
import { memo } from "react";
import { TASK_CONTEXT } from "@/constants";
import { DashboardContextSection } from "./dashboard-context-section";
import { TaskContext, TaskProgress } from "@/types";

interface ContextSectionsProps {
  contextData: Partial<Record<TaskContext, TaskProgress>>;
}

export const ContextSections = memo(({ contextData }: ContextSectionsProps) => (
  <Box className="-mx-1.5 flex-row flex-wrap">
    {Object.values(TASK_CONTEXT).map((context) => {
      const data = contextData[context];
      if (!data) return null;

      return (
        <Box key={context} className="mb-3 w-1/2 px-1.5">
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
