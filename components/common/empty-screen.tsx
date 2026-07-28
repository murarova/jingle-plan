import { Box } from "@/ui/box";
import { Text } from "@/ui/text";
import Snowman from "../../assets/svg/snowman";
import { useTranslation } from "react-i18next";

export function EmptyScreen() {
  const { t } = useTranslation();
  return (
    <Box className="flex-1 items-center justify-center">
      <Snowman />
      <Text className="mt-10">{t("common.empty")}</Text>
    </Box>
  );
}
