import { useLayoutEffect, useState, useEffect, memo, useCallback } from "react";
import { TasksList } from "../components/tasks-list";
import { Box, SafeAreaView } from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { CompletedTaskModal } from "../components/modals/completed-task-modal";
import usePrevious from "../hooks/usePrevious";
import { StackScreenProps } from "@react-navigation/stack";
import isNil from "lodash/isNil";
import { useDayTasks } from "../hooks/useDayTasks";
import { HomeStackParamList } from "./home-screen";
import { ProgressBar, EmptyState } from "../components/common";

type Props = StackScreenProps<HomeStackParamList, "DayOverview">;

const DayOverviewScreen: React.FC<Props> = memo(({ route, navigation }) => {
  const { t } = useTranslation();
  const currentDay = route.params.currentDay;
  const { dayTasks, total, refresh, error } = useDayTasks(currentDay);

  const previousProgress = usePrevious(total);
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  const handleRetry = useCallback(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!isNil(previousProgress) && previousProgress < 100 && total === 100) {
      setShowCompletedModal(true);
    }
  }, [total, previousProgress]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: moment(currentDay).format("DD.MM.YYYY"),
    });
  }, [currentDay, navigation]);

  if (error) {
    return (
      <SafeAreaView flex={1}>
        <Box flex={1}>
          <EmptyState message={t("common.error")} onRetry={handleRetry} />
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView flex={1}>
      <Box p="$2" flex={1}>
        {dayTasks ? (
          <>
            <ProgressBar total={total} t={t} />
            <TasksList {...dayTasks.config} currentDay={currentDay} />
          </>
        ) : (
          <EmptyState message={t("common.empty")} />
        )}
        {showCompletedModal && (
          <CompletedTaskModal setShowModal={setShowCompletedModal} />
        )}
      </Box>
    </SafeAreaView>
  );
});

DayOverviewScreen.displayName = "DayOverviewScreen";

export default DayOverviewScreen;
