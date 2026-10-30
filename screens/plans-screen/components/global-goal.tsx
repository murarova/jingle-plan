import { Text } from "@/ui/text";
import { Heading } from "@/ui/heading";
import { Center } from "@/ui/center";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface GlobalGoalProps {
  text: string;
  year: string;
}

export const GlobalGoal = memo(({ text, year }: GlobalGoalProps) => {
  const { t } = useTranslation();

  return (
    <Center className="px-4 pb-4">
      <Text className="pb-1 text-secondaryText">
        {t("screens.plansScreen.globalGoalTitle", { year: Number(year) + 1 })}
      </Text>
      <Heading size="sm" className="text-center text-primaryText">
        {text}
      </Heading>
    </Center>
  );
});

GlobalGoal.displayName = "GlobalGoal";
