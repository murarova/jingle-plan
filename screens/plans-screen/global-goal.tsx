import { memo } from "react";
import { Center, Heading, Text } from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";

interface GlobalGoalProps {
  text: string;
  year: string;
}

export const GlobalGoal = memo(({ text, year }: GlobalGoalProps) => {
  const { t } = useTranslation();

  return (
    <Center pt="$4" pb="$2">
      <Text pb="$2">
        {t("screens.plansScreen.globalGoalTitle", { year: Number(year) + 1 })}
      </Text>
      <Heading textAlign="center" size="sm">
        {text}
      </Heading>
    </Center>
  );
});

GlobalGoal.displayName = "GlobalGoal";
