import { Pressable } from "@/ui/pressable";
import { VStack } from "@/ui/vstack";
import { HStack } from "@/ui/hstack";
import { Text } from "@/ui/text";
import { Progress, ProgressFilledTrack } from "@/ui/progress";
import { Heading } from "@/ui/heading";
import { Box } from "@/ui/box";
import { Icon, ChevronRightIcon } from "@/ui/icon";
import { useTranslation } from "react-i18next";
import {
  getProgressBackgroundColor,
  getProgressColorByValue,
} from "../../utils/utils";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "../../constants/constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { TaskContext } from "../../types/types";
import { RootStackParamList } from "@/navigation/types";

type NavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export function DashboardContextSection({
  percentage,
  context,
}: {
  percentage: number;
  totalTasks: number;
  doneTasks: number;
  context: TaskContext;
}) {
  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp>();

  return (
    <Pressable
      onPress={() => nav.navigate(SCREENS.HOME, { screen: SCREENS.PLANS })}
    >
      <Box className="bg-warmGray-100 p-2 m-2 rounded-xl">
        <Heading size="sm" className="mb-4">
          {t(`context.${context}`)}
        </Heading>

        <VStack space="sm">
          <Box>
            <Progress value={percentage} className="h-2">
              <ProgressFilledTrack
                className={getProgressColorByValue(percentage)}
                style={{
                  backgroundColor: getProgressBackgroundColor(percentage),
                }}
              />
            </Progress>
            <HStack className="justify-between items-center mt-5">
              <Text size="sm" className="font-[600]">
                {percentage}%
              </Text>
              <Icon as={ChevronRightIcon} className="self-end" />
            </HStack>
          </Box>
        </VStack>
      </Box>
    </Pressable>
  );
}
