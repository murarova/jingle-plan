import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { YoutubePlayer } from "../common";
import { TaskItem } from "./task-item";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
    <KeyboardAwareScrollView
      extraScrollHeight={180}
      enableResetScrollToCoords={false}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <Box className="pb-[30px]">
        {videoText && <Text className="pb-4">{videoText}</Text>}
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
