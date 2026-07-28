import { useEffect } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SCREENS } from "../../constants/constants";
import { useAppSelector } from "../../store/withTypes";
import { isLoggedIn } from "../../store/authReducer";
import { RootStackParamList } from "../../App";
import { useCalendarDayManager } from "../../hooks/useCalendarDayManager";
import { Box } from "@/ui/box";

export const LoadingScreen = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const isUserLoggedIn = useAppSelector(isLoggedIn);
  const { isLoading } = useCalendarDayManager();

  useEffect(() => {
    if (isUserLoggedIn && !isLoading) {
      nav.navigate(SCREENS.HOME);
    } else if (!isUserLoggedIn) {
      nav.navigate(SCREENS.INTRO);
    }
  }, [isUserLoggedIn, isLoading, nav]);

  return <Box className="flex-1 bg-white" />;
};
