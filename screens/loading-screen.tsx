import { useEffect } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SCREENS } from "../constants/constants";
import { Loader } from "../components/common";
import { useAppSelector } from "../store/withTypes";
import { isLoggedIn } from "../store/authReducer";
import { RootStackParamList } from "../App";
import { useCalendarDayManager } from "../hooks/useCalendarDayManager";

export const LoadingScreen = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const isUserLoggedIn = useAppSelector(isLoggedIn);
  const { isLoading } = useCalendarDayManager();

  useEffect(() => {
    if (isUserLoggedIn && !isLoading) {
      nav.navigate(SCREENS.HOME);
    } else {
      nav.navigate(SCREENS.INTRO);
    }
  }, [isUserLoggedIn, nav]);

  return <Loader />;
};
