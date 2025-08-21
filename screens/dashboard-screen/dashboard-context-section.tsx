import {
  Box,
  Heading,
  Progress,
  ProgressFilledTrack,
  Text,
  ChevronRightIcon,
  Button,
  ButtonIcon,
  HStack,
  VStack,
} from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";
import { getProgressColorByValue, getPluralForm } from "../../utils/utils";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "../../constants/constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { TaskContext } from "../../types/types";
import { RootStackParamList } from "../../App";

type NavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export function DashboardContextSection({
  percentage,
  totalTasks,
  doneTasks,
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
    <Box
      p="$2"
      m="$2"
      backgroundColor={config.tokens.colors.warmGray100}
      borderRadius="$xl"
    >
      <Heading size="sm" mb="$4">
        {t(`context.${context}`)}
      </Heading>

      <VStack space="sm" mb="$3">
        <Box>
          <Progress value={percentage} size="sm">
            <ProgressFilledTrack bg={getProgressColorByValue(percentage)} />
          </Progress>
          <HStack justifyContent="space-between" alignItems="center" mt="$1">
            <Text size="sm" fontWeight="600">
              {percentage}%
            </Text>
            <Text size="xs" color={config.tokens.colors.warmGray600}>
              {doneTasks}/{totalTasks} {getPluralForm(totalTasks, t)}
            </Text>
          </HStack>
        </Box>
      </VStack>

      <Button
        onPress={() => nav.navigate(SCREENS.HOME, { screen: SCREENS.PLANS })}
        variant="link"
        alignSelf="flex-end"
      >
        <ButtonIcon color="$warmGray900" as={ChevronRightIcon} />
      </Button>
    </Box>
  );
}
