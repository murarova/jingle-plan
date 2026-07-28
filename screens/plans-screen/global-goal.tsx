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
    <Center className="pt-4 pb-2">
      <Text className="pb-2">
        {t("screens.plansScreen.globalGoalTitle", { year: Number(year) + 1 })}
      </Text>
      <Heading size="sm" className="text-center">
        {text}
      </Heading>
    </Center>
  );
});

GlobalGoal.displayName = "GlobalGoal";
