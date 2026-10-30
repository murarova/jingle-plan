import { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SCREENS } from "@/constants";
import { useAppSelector } from "../../store/withTypes";
import { isLoggedIn } from "../../store/authReducer";
import { RootStackParamList } from "@/navigation/types";
import { useCalendarDayManager } from "../../hooks/useCalendarDayManager";
import { Loader } from "@/components/common";
import { Box } from "@/ui/box";

export const LoadingScreen = () => {
  const nav =
    useNavigation<StackNavigationProp<RootStackParamList, "Loading">>();
  const isUserLoggedIn = useAppSelector(isLoggedIn);
  const { isInitialLoading } = useCalendarDayManager();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (hasNavigated.current) return;
    if (isUserLoggedIn && isInitialLoading) return;

    hasNavigated.current = true;
    nav.replace(isUserLoggedIn ? SCREENS.HOME : SCREENS.INTRO);
  }, [isUserLoggedIn, isInitialLoading, nav]);

  if (isUserLoggedIn && isInitialLoading) {
    return <Loader size="large" />;
  }

  return <Box className="flex-1" />;
};
