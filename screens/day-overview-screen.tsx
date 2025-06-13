import { useLayoutEffect, useState, useEffect } from "react";
import { TasksList } from "../components/tasks-list";
import {
  Box,
  Text,
  Center,
  Progress,
  ProgressFilledTrack,
  HStack,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { CompletedTaskModal } from "../components/modals/completed-task-modal";
import {
  calculateTotalProgress,
  getProgressColorByValue,
} from "../utils/utils";
import { usePeriodOverviewScreenManager } from "../hooks/usePeriodOverviewScreenManager";
import usePrevious from "../hooks/usePrevious";
import { RootStackParamList } from "../App";
import { StackScreenProps } from "@react-navigation/stack";
import isNil from "lodash/isNil";

type Props = StackScreenProps<RootStackParamList, "DayOverview">;

const DayOverviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useTranslation();

  const { getDayConfig } = usePeriodOverviewScreenManager();

  const currentDay = route.params.currentDay;
  const dayTasks = getDayConfig(currentDay);

  const total = dayTasks ? calculateTotalProgress(dayTasks.progress) : 0;

  const previousProgress = usePrevious(total);
  const [showComplitedModal, setShowComplitedModal] = useState(false);

  useEffect(() => {
    if (!isNil(previousProgress) && previousProgress < 100 && total === 100) {
      setShowComplitedModal(true);
    }
  }, [total]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: moment(currentDay).format("DD.MM.YYYY"),
    });
  }, [currentDay, navigation]);

  return (
    <Box p="$2" flex={1}>
      {dayTasks ? (
        <>
          <Box my="$2.5">
            <HStack justifyContent="space-between">
              <Text size="md">{t("screens.processText")}</Text>
              <Text size="md">{total + "%"}</Text>
            </HStack>

            <Center my="$2.5" mb="$2.5">
              <Progress value={total} size="sm">
                <ProgressFilledTrack bg={getProgressColorByValue(total)} />
              </Progress>
            </Center>
          </Box>
          <TasksList {...dayTasks.config} currentDay={currentDay} />
        </>
      ) : (
        <Center flex={1}>
          <Text fontSize="$xl">{t("common.empty")}</Text>
        </Center>
      )}
      {showComplitedModal && (
        <CompletedTaskModal setShowModal={setShowComplitedModal} />
      )}
    </Box>
  );
};

export default DayOverviewScreen;
