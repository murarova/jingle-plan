import { Box } from "@/ui/box";
import { Divider } from "@/ui/divider";
import { HStack } from "@/ui/hstack";
import { Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTranslation } from "react-i18next";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionButtons = ({ onEdit, onDelete }: ActionButtonsProps) => {
  const { t } = useTranslation();

  return (
    <Box className="mt-4 w-full gap-4">
      <Divider className="w-full bg-ivory-line" />
      <HStack className="w-full items-center justify-end gap-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("screens.tasksOfTheDay.editBtnText")}
          onPress={onEdit}
          className="h-11 w-11 items-center justify-center rounded-[14px] bg-primary-500"
        >
          <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
            <Path
              d="M13.7503 4.58255L13.7567 4.58888M13.7567 4.58888L17.4112 8.24303M13.7567 4.58888L15.7561 2.58919C16.2408 2.10467 16.8981 1.83251 17.5835 1.8326C18.2689 1.83269 18.9262 2.105 19.4107 2.58964C19.8953 3.07429 20.1675 3.73155 20.1674 4.41685C20.1673 5.10215 19.895 5.75935 19.4103 6.24387L17.4112 8.24303M13.7567 4.58888L3.52119 14.8256C3.30834 15.0378 3.15093 15.299 3.06282 15.5864L1.85179 19.5756C1.8281 19.6549 1.82631 19.7391 1.84661 19.8193C1.86692 19.8995 1.90856 19.9728 1.96712 20.0312C2.02567 20.0897 2.09897 20.1312 2.17922 20.1514C2.25947 20.1715 2.34368 20.1696 2.42293 20.1458L6.41353 18.9358C6.70063 18.8485 6.96191 18.6921 7.17443 18.4802L17.4112 8.24303M17.4112 8.24303L17.4173 8.24916"
              stroke="white"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.delete")}
          onPress={onDelete}
          className="h-11 w-11 items-center justify-center rounded-[14px] bg-[#f4f0e8]"
        >
          <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
            <Path
              d="M9.16667 10.0833V15.5837M12.8333 10.0833V15.5837M17.4167 5.49956V18.3339C17.4167 18.8202 17.2235 19.2865 16.8797 19.6304C16.5359 19.9742 16.0696 20.1674 15.5833 20.1674H6.41667C5.93044 20.1674 5.46412 19.9742 5.1203 19.6304C4.77649 19.2865 4.58333 18.8202 4.58333 18.3339V5.49956M17.4167 5.49956H14.6667M17.4167 5.49956H19.25M4.58333 5.49956H2.75M4.58333 5.49956H7.33333M7.33333 5.49956H14.6667M7.33333 5.49956V3.66608C7.33333 3.17981 7.52649 2.71346 7.8703 2.36961C8.21412 2.02577 8.68044 1.8326 9.16667 1.8326H12.8333C13.3196 1.8326 13.7859 2.02577 14.1297 2.36961C14.4735 2.71346 14.6667 3.17981 14.6667 3.66608V5.49956"
              stroke="#787165"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
      </HStack>
    </Box>
  );
};
