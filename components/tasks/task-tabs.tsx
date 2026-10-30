import { Pressable } from "@/ui/pressable";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { useTranslation } from "react-i18next";

export type DayTaskTab = "day" | "mood";

interface TaskTabsProps {
  selected: DayTaskTab;
  onChange: (tab: DayTaskTab) => void;
}

export function TaskTabs({ selected, onChange }: TaskTabsProps) {
  const { t } = useTranslation();

  const tabs: { id: DayTaskTab; label: string }[] = [
    { id: "day", label: t("screens.tasksOfTheDay.dayTitle") },
    { id: "mood", label: t("screens.tasksOfTheDay.moodTitle") },
  ];

  return (
    <Box className="w-full flex-row gap-1 overflow-hidden rounded-[20px] bg-ivory-badge p-1">
      {tabs.map((tab) => {
        const isSelected = selected === tab.id;

        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(tab.id)}
            className={`h-12 flex-1 items-center justify-center rounded-2xl px-1.5 ${
              isSelected ? "bg-primary-500" : "bg-transparent"
            }`}
          >
            <Text
              size="sm"
              bold
              className={`text-center ${isSelected ? "text-white" : "text-primaryText"}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </Box>
  );
}
