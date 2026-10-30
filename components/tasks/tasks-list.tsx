import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { useEffect, useState } from "react";
import { KeyboardAwareScroll, YoutubePlayer } from "../common";
import { TaskItem } from "./task-item";
import { DayTaskTab, TaskTabs } from "./task-tabs";
import { DayTaskConfig, UserData } from "@/types";

interface TaskListProps {
  videoText: string;
  videoId: string;
  dayTaskConfig: DayTaskConfig;
  moodTaskConfig: DayTaskConfig;
  currentDay: string;
  userData?: UserData | null;
}

export function TasksList({
  videoText,
  videoId,
  dayTaskConfig,
  moodTaskConfig,
  currentDay,
  userData,
}: TaskListProps) {
  const [selectedTab, setSelectedTab] = useState<DayTaskTab>("day");

  useEffect(() => {
    setSelectedTab("day");
  }, [currentDay]);

  const activeTab: DayTaskTab =
    selectedTab === "mood" && moodTaskConfig
      ? "mood"
      : dayTaskConfig
        ? "day"
        : "mood";
  const activeConfig = activeTab === "mood" ? moodTaskConfig : dayTaskConfig;

  return (
    <KeyboardAwareScroll>
      <Box className="gap-5 pb-5">
        {videoText && (
          <Box className="rounded-3xl border border-ivory-line bg-ivory-card p-5">
            <Text>{videoText}</Text>
          </Box>
        )}
        {videoId && (
          <Box className="rounded-3xl border border-ivory-line bg-ivory-card p-3">
            <YoutubePlayer videoId={videoId} />
          </Box>
        )}
        {activeConfig && (
          <Box className="gap-3">
            {dayTaskConfig && moodTaskConfig && (
              <TaskTabs selected={activeTab} onChange={setSelectedTab} />
            )}
            <TaskItem
              currentDay={currentDay}
              taskConfig={activeConfig}
              userData={userData}
            />
          </Box>
        )}
      </Box>
    </KeyboardAwareScroll>
  );
}
