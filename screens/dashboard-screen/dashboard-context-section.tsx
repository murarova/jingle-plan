import { Pressable } from "@/ui/pressable";
import { HStack } from "@/ui/hstack";
import { Text } from "@/ui/text";
import { Progress, ProgressFilledTrack } from "@/ui/progress";
import { useTranslation } from "react-i18next";
import { getProgressBackgroundColor } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "@/constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { TaskContext } from "@/types";
import { RootStackParamList } from "@/navigation/types";
import { colors } from "@/constants/colors";
import { typeRole } from "@/constants/typography";
import Svg, { Path, Rect } from "react-native-svg";

type NavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export function DashboardContextSection({
  percentage,
  context,
}: {
  percentage: number;
  context: TaskContext;
}) {
  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp>();

  return (
    <Pressable
      onPress={() => nav.navigate(SCREENS.HOME, { screen: SCREENS.PLANS })}
      className="h-[118px] gap-3 rounded-[20px] border border-ivory-line bg-ivory-card p-4"
    >
      <Text className={`${typeRole.body} text-primaryText`} numberOfLines={1}>
        {t(`context.${context}`)}
      </Text>
      <Progress
        value={percentage}
        className="h-2 w-full rounded-full bg-[#eae5d9]"
      >
        <ProgressFilledTrack
          style={{ backgroundColor: getProgressBackgroundColor(percentage) }}
        />
      </Progress>
      <HStack className="h-[30px] items-center justify-between">
        <Text
          className="text-primaryText"
          style={{ fontSize: 22, lineHeight: 28, fontWeight: "700" }}
        >
          {percentage}%
        </Text>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect width={24} height={24} rx={12} fill={colors.ivoryPage} />
          <Path
            d="M14.5 12C14.4951 12.1776 14.4315 12.3399 14.2945 12.4718L10.4883 16.3275C10.3806 16.4391 10.2436 16.5 10.0822 16.5C9.7593 16.5 9.5 16.2362 9.5 15.9014C9.5 15.739 9.5636 15.5817 9.67613 15.4651L13.1057 12.0051L9.67613 8.53495C9.56849 8.41826 9.5 8.26607 9.5 8.09865C9.5 7.76381 9.7593 7.5 10.0822 7.5C10.2436 7.5 10.3806 7.56088 10.4883 7.67249L14.2945 11.5333C14.4315 11.6702 14.5 11.8224 14.5 12Z"
            fill={colors.secondaryText}
          />
        </Svg>
      </HStack>
    </Pressable>
  );
}
