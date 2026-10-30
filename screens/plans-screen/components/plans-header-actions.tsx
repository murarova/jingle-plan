import { colors } from "@/constants/colors";
import { Box } from "@/ui/box";
import { Pressable } from "@/ui/pressable";
import { AppMenu } from "@/components/navigation/app-menu";
import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { usePlansSearch } from "../plans-search-context";
import { useAppSelector } from "../../../store/withTypes";
import { useGetUserDataQuery } from "../../../services/api";
import { PlanContextData } from "@/types";

function hasPlanItems(plans: PlanContextData | null | undefined) {
  if (!plans) return false;
  return Object.values(plans).some((items) => (items?.length ?? 0) > 0);
}

export function PlansHeaderActions() {
  const { t } = useTranslation();
  const { toggleSearch } = usePlansSearch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { selectedYear } = useAppSelector((state) => state.app);
  const { data: userData } = useGetUserDataQuery(
    { uid: currentUser?.uid!, year: selectedYear },
    { skip: !currentUser?.uid || !selectedYear },
  );
  const showSearch = hasPlanItems(userData?.plans as PlanContextData | null);

  return (
    <Box className="flex-row items-center">
      {showSearch && (
        <Pressable
          testID="plans-search-toggle"
          accessibilityRole="button"
          accessibilityLabel={t("screens.plansScreen.filter")}
          className="h-11 w-11 items-center justify-center"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
              () => {},
            );
            toggleSearch();
          }}
        >
          <Search size={20} color={colors.primaryText} />
        </Pressable>
      )}
      <AppMenu />
    </Box>
  );
}

export function PlansHeaderRight() {
  return <PlansHeaderActions />;
}
