import { Box, Text } from "@gluestack-ui/themed";
import { YoutubePlayer } from "./common";
import { TaskItem } from "./task-item";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DayTaskConfig } from "../types/types";

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
    <KeyboardAwareScrollView extraScrollHeight={180}>
      <Box pb={30}>
        {videoText && <Text pb="$4">{videoText}</Text>}
        {videoId && <YoutubePlayer videoId={videoId} />}
        {dayTaskConfig && (
          <TaskItem currentDay={currentDay} taskConfig={dayTaskConfig} />
        )}
        {moodTaskConfig && (
          <TaskItem currentDay={currentDay} taskConfig={moodTaskConfig} />
        )}
      </Box>
    </KeyboardAwareScrollView>
  );
}
