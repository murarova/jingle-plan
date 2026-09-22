import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { KeyboardAwareScroll, YoutubePlayer } from "../common";
import { TaskItem } from "./task-item";
import { DayTaskConfig } from "@/types";

interface TaskListProps {
  videoText: string;
  videoId: string;
  dayTaskConfig: DayTaskConfig;
  moodTaskConfig: DayTaskConfig;
  currentDay: string;
}

export function TasksList({
  videoText,
  videoId,
  dayTaskConfig,
  moodTaskConfig,
  currentDay,
}: TaskListProps) {
  return (
    <KeyboardAwareScroll>
      <Box>
        {videoText && <Text className="pb-4">{videoText}</Text>}
        {videoId && <YoutubePlayer videoId={videoId} />}
        {dayTaskConfig && (
          <TaskItem currentDay={currentDay} taskConfig={dayTaskConfig} />
        )}
        {moodTaskConfig && (
          <TaskItem currentDay={currentDay} taskConfig={moodTaskConfig} />
        )}
      </Box>
    </KeyboardAwareScroll>
  );
}
