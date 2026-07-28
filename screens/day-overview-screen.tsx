import { Box } from "@/components/ui/box";
import { useLayoutEffect, useState, useEffect, memo, useCallback } from "react";
import { TasksList } from "../components/tasks-list";
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
      <Box className="flex-1">
        <Box className="flex-1">
          <EmptyState message={t("common.error")} onRetry={handleRetry} />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="flex-1">
      <Box className="p-2 flex-1">
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
    </Box>
  );
});

DayOverviewScreen.displayName = "DayOverviewScreen";

export default DayOverviewScreen;
