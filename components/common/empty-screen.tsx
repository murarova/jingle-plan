import { Box } from "@/ui/box";
import { Heading } from "@/ui/heading";
import { Text } from "@/ui/text";
import { typeRole } from "@/constants/typography";
import Snowman from "../../assets/svg/snowman";
import { useTranslation } from "react-i18next";

export function EmptyScreen() {
  const { t } = useTranslation();
  return (
    <Box className="flex-1 items-center justify-center px-6">
      <Box className="w-full max-w-[320px] items-center gap-6">
        <Box className="items-center justify-center overflow-hidden rounded-[32px] border border-ivory-line bg-ivory-card p-10">
          <Snowman />
        </Box>
        <Box className="w-full items-center gap-2">
          <Heading size="lg" className="text-center text-primaryText">
            {t("common.empty")}
          </Heading>
          <Text className={`${typeRole.secondary} text-center text-secondaryText`}>
            {t("common.emptyNote")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
