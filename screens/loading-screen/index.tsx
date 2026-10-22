import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SCREENS } from "@/constants";
import { useAppSelector } from "../../store/withTypes";
import { isLoggedIn } from "../../store/authReducer";
import { RootStackParamList } from "@/navigation/types";
import { useCalendarDayManager } from "../../hooks/useCalendarDayManager";
import { Box } from "@/ui/box";

export const LoadingScreen = () => {
  const nav = useNavigation<StackNavigationProp<RootStackParamList, "Loading">>();
  const isUserLoggedIn = useAppSelector(isLoggedIn);
  const { isLoading } = useCalendarDayManager();

  useEffect(() => {
    if (isUserLoggedIn && !isLoading) {
      nav.replace(SCREENS.HOME);
    } else if (!isUserLoggedIn) {
      nav.replace(SCREENS.INTRO);
    }
  }, [isUserLoggedIn, isLoading, nav]);

  return <Box className="flex-1 bg-white" />;
};
