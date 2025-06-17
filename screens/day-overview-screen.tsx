import {
  useLayoutEffect,
  useState,
  useEffect,
  memo,
  useMemo,
  useCallback,
} from "react";
import { TasksList } from "../components/tasks-list";
import {
  Box,
  Text,
  Center,
  Progress,
  ProgressFilledTrack,
  HStack,
  VStack,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { CompletedTaskModal } from "../components/modals/completed-task-modal";
import { getProgressColorByValue } from "../utils/utils";
import usePrevious from "../hooks/usePrevious";
import { RootStackParamList } from "../App";
import { StackScreenProps } from "@react-navigation/stack";
import isNil from "lodash/isNil";
import { Loader } from "../components/common";
import { useDayTasks } from "../hooks/useDayTasks";

type Props = StackScreenProps<RootStackParamList, "DayOverview">;

interface ProgressBarProps {
  total: number;
  t: (key: string) => string;
}

const ProgressBar = memo(({ total, t }: ProgressBarProps) => (
  <Box my="$2.5">
    <HStack justifyContent="space-between">
      <Text size="md">{t("screens.processText")}</Text>
      <Text size="md">{`${total}%`}</Text>
    </HStack>

    <Center my="$2.5" mb="$2.5">
      <Progress value={total} size="sm">
        <ProgressFilledTrack bg={getProgressColorByValue(total)} />
      </Progress>
    </Center>
  </Box>
));

ProgressBar.displayName = "ProgressBar";

interface EmptyStateProps {
  message: string;
  onRetry?: () => void;
}

const EmptyState = memo(({ message, onRetry }: EmptyStateProps) => (
  <Center flex={1}>
    <VStack space="md" alignItems="center">
      <Text fontSize="$xl">{message}</Text>
      {onRetry && (
        <Button onPress={onRetry}>
          <ButtonText>Retry</ButtonText>
        </Button>
      )}
    </VStack>
  </Center>
));

EmptyState.displayName = "EmptyState";

const DayOverviewScreen: React.FC<Props> = memo(({ route, navigation }) => {
  const { t } = useTranslation();
  const currentDay = route.params.currentDay;
  const { dayTasks, total, status, error, refresh } = useDayTasks(currentDay);

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

  if (status === "pending" && !dayTasks) {
    return (
      <Box flex={1}>
        <Loader absolute />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1}>
        <EmptyState message={t("common.error")} onRetry={handleRetry} />
      </Box>
    );
  }

  return (
    <Box p="$2" flex={1}>
      {status === "pending" && <Loader absolute />}
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
  );
});

DayOverviewScreen.displayName = "DayOverviewScreen";

export default DayOverviewScreen;
