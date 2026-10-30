import { colors } from "@/constants/colors";
import { months, PlansViewOptions } from "@/constants";
import { Badge, BadgeIcon, BadgeText } from "@/ui/badge";
import { Checkbox, CheckboxIndicator, CheckboxLabel } from "@/ui/checkbox";
import Svg, { Path } from "react-native-svg";
import { Divider } from "@/ui/divider";
import { Menu, MenuItem } from "@/ui/menu";
import { View } from "react-native";
import { Button, ButtonIcon } from "@/ui/button";
import { HStack } from "@/ui/hstack";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { CalendarDays, Ellipsis } from "lucide-react-native";
import { Fragment } from "react";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { PlanScreenData } from "@/types";
import { CompletePlanProps } from "../context-view/types";

interface PlansListProps {
  plans: PlanScreenData[];
  onEdit: (plan: PlanScreenData) => void;
  onDelete: (plan: PlanScreenData) => void;
  onMonthSelect: (plan: PlanScreenData) => void;
  onCopyToNextYear?: (plan: PlanScreenData) => void;
  handleCompletePlan: (props: CompletePlanProps) => void;
  view?: PlansViewOptions;
  month?: string;
}

export function PlansList({
  plans,
  onEdit,
  onDelete,
  handleCompletePlan,
  onMonthSelect,
  view,
  month,
}: PlansListProps) {
  const { t } = useTranslation();

  function getMonthBadge(item: PlanScreenData) {
    if (item.month === "every") {
      return t("screens.plansScreen.everyMonthLabel");
    }
    return months.find((entry) => entry.value === item.month)?.long;
  }

  return (
    <Box className="w-full">
      {plans.map((item, index, array) => {
        const isDone =
          Boolean(
            item.monthlyProgress?.find((planMonth) => planMonth.month === month)
              ?.isDone,
          ) || item?.isDone;
        const label = getMonthBadge(item);
        return (
          <Fragment key={item.id}>
            {view === PlansViewOptions.context && label && (
              <HStack>
                <Badge
                  action="gray"
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                >
                  <BadgeText>{label}</BadgeText>
                  <BadgeIcon as={CalendarDays} className="ml-2" />
                </Badge>
              </HStack>
            )}
            {view === PlansViewOptions.month && (
              <HStack>
                <Badge
                  action="gray"
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                >
                  <BadgeText>{t(`context.${item.context}`)}</BadgeText>
                </Badge>
              </HStack>
            )}
            <HStack className="min-h-11 items-center gap-2.5">
              <Box className="min-w-0 flex-1">
                <Checkbox
                  value={item?.text}
                  isChecked={isDone}
                  hitSlop={14}
                  className="w-full"
                  onChange={(value) =>
                    handleCompletePlan({
                      plan: item,
                      value,
                      context: item.context,
                      month,
                    })
                  }
                  aria-label={item?.text}
                >
                  <CheckboxIndicator
                    style={{ borderWidth: 1.5 }}
                    className="h-[22px] w-[22px] shrink-0 rounded-full border-[#d5ccbc] bg-transparent data-[checked=true]:border-[#7EB344] data-[checked=true]:bg-[#EAF0DE] data-[hover=true]:data-[checked=true]:border-[#7EB344] data-[hover=true]:data-[checked=true]:bg-[#EAF0DE] data-[active=true]:data-[checked=true]:border-[#7EB344] data-[active=true]:data-[checked=true]:bg-[#EAF0DE]"
                  >
                    {isDone ? (
                      <Svg
                        width={12}
                        height={10}
                        viewBox="0 0 12 10"
                        fill="none"
                      >
                        <Path
                          d="M9.9996 2.5L4.50015 7.083L2.0004 4.99982"
                          stroke="#4E7129"
                          strokeWidth={2}
                          strokeLinecap="round"
                        />
                      </Svg>
                    ) : null}
                  </CheckboxIndicator>
                  <CheckboxLabel className="py-2 min-w-0 flex-1 shrink">
                    <Text
                      className="shrink text-primaryText"
                      style={
                        isDone && {
                          textDecorationLine: "line-through",
                          textDecorationStyle: "solid",
                          opacity: 0.5,
                        }
                      }
                    >
                      {item?.text}
                    </Text>
                  </CheckboxLabel>
                </Checkbox>
              </Box>
              <Menu
                placement="bottom right"
                offset={6}
                trigger={({ ...triggerProps }) => {
                  return (
                    <Button
                      className="h-11 w-11"
                      variant="link"
                      {...triggerProps}
                      onPress={(e) => {
                        try {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light,
                          );
                        } catch {}
                        triggerProps.onPress?.(e);
                      }}
                    >
                      <ButtonIcon as={Ellipsis} className="text-primaryText" />
                    </Button>
                  );
                }}
                className="overflow-visible rounded-2xl"
                style={{
                  width: 223,
                  backgroundColor: colors.ivoryCard,
                  borderRadius: 16,
                  paddingVertical: 0,
                  overflow: "visible",
                  shadowColor: "#2B211A",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.12,
                  shadowRadius: 10,
                  elevation: 6,
                }}
              >
                <MenuItem
                  key="edit"
                  textValue="edit"
                  onPress={() => onEdit(item)}
                  className="rounded-b-none rounded-t-2xl border-b-[0.5px] border-ivory-line bg-ivory-card px-4 py-[13px] data-[active=true]:bg-ivory-badge"
                >
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      top: -5,
                      right: 18,
                      width: 10,
                      height: 10,
                      backgroundColor: colors.ivoryCard,
                      transform: [{ rotate: "45deg" }],
                    }}
                  />
                  <Text className="text-primaryText">{t("common.edit")}</Text>
                </MenuItem>
                <MenuItem
                  key="selectMonth"
                  textValue="selectMonth"
                  onPress={() => onMonthSelect(item)}
                  className="rounded-none border-b-[0.5px] border-ivory-line bg-ivory-card px-4 py-[13px] data-[active=true]:bg-ivory-badge"
                >
                  <Text className="text-primaryText">{t("common.selectMonth")}</Text>
                </MenuItem>
                <MenuItem
                  key="delete"
                  textValue="delete"
                  onPress={() => onDelete(item)}
                  className="rounded-b-2xl rounded-t-none bg-ivory-card px-4 py-[13px] data-[active=true]:bg-ivory-badge"
                >
                  <Text style={{ color: colors.primary500 }}>
                    {t("common.delete")}
                  </Text>
                </MenuItem>
              </Menu>
            </HStack>
            {index !== array.length - 1 && (
              <Divider className="bg-[#eee8dc] mb-2.5" />
            )}
          </Fragment>
        );
      })}
    </Box>
  );
}
