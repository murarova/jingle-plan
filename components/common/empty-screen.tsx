import { Box } from "@/ui/box";
import Snowman from "../../assets/svg/snowman";
import { useTranslation } from "react-i18next";
import { Heading } from "@/ui/heading";

export function EmptyScreen() {
  const { t } = useTranslation();
  return (
    <Box className="flex-1 items-center justify-center px-6">
      <Box className="w-full items-center gap-9">
        <Box className="p-10 items-center justify-center overflow-hidden rounded-[32px] border border-ivory-line bg-ivory-card">
          <Snowman />
        </Box>
        <Heading className={"text-secondaryText"}>{t("common.empty")}</Heading>
      </Box>
    </Box>
  );
}
