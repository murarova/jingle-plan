import { memo } from "react";
import { Center, Heading, Text } from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";

interface GlobalGoalProps {
  text: string;
}

export const GlobalGoal = memo(({ text }: GlobalGoalProps) => {
  const { t } = useTranslation();

  return (
    <Center pt="$4" pb="$2">
      <Text pb="$2">{t("screens.plansScreen.globalGoalTitle")}</Text>
      <Heading textAlign="center" size="sm">
        {text}
      </Heading>
    </Center>
  );
});

GlobalGoal.displayName = "GlobalGoal";
