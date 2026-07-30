import { Badge, BadgeText, BadgeIcon } from "@/ui/badge";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "@/ui/checkbox";
import { ScrollView } from "@/ui/scroll-view";
import { Divider } from "@/ui/divider";
import { Icon, CheckIcon } from "@/ui/icon";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "@/ui/menu";
import { Button, ButtonIcon } from "@/ui/button";
import { VStack } from "@/ui/vstack";
import { HStack } from "@/ui/hstack";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import {
  EditIcon,
  Trash2,
  Ellipsis,
  CalendarDays,
  Copy,
} from "lucide-react-native";
import { Fragment } from "react";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { months, PlansViewOptions } from "@/constants";
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
  onCopyToNextYear,
  view,
  month,
}: PlansListProps) {
  const { t } = useTranslation();

  function getMonthBadge(item: PlanScreenData) {
    if (item.month === "every") {
      return t("screens.plansScreen.everyMonthLabel");
    } else {
      return months.find((month) => month.value === item.month)?.long;
    }
  }

  return (
    <ScrollView className="max-h-80 w-full">
      <VStack space="sm" className="w-full flex-1">
        {plans.map((item, index, array) => {
          const label = getMonthBadge(item);
          const isDone =
            Boolean(
              item.monthlyProgress?.find(
                (planMonth) => planMonth.month === month,
              )?.isDone,
            ) || item?.isDone;
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
              <HStack className="justify-between items-center">
                <Box className="flex-1 mr-2">
                  <Checkbox
                    value={item?.text}
                    isChecked={isDone}
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
                    <CheckboxIndicator className="mr-2">
                      <CheckboxIcon as={CheckIcon} className="text-white" />
                    </CheckboxIndicator>
                    <CheckboxLabel className="flex-1">
                      <Text
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
                  placement="top"
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Button
                        className="px-3 py-2"
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
                        <ButtonIcon as={Ellipsis} className="text-black" />
                      </Button>
                    );
                  }}
                  className="rounded-lg mr-2"
                  style={{ backgroundColor: "#FFFFFF", paddingVertical: 0 }}
                >
                  <MenuItem
                    key="edit"
                    textValue="edit"
                    onPress={() => onEdit(item)}
                    className="rounded-t-lg flex bg-[#fff] justify-between p-3 min-h-[48px] active:bg-coolGray-200 hover:bg-coolGray-100"
                  >
                    <MenuItemLabel className="text-base">
                      {t("common.edit")}
                    </MenuItemLabel>
                    <Icon as={EditIcon} size="sm" className="ml-3" />
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    key="selectMonth"
                    textValue="selectMonth"
                    onPress={() => onMonthSelect(item)}
                    className="bg-[#fff] flex justify-between p-3 min-h-[48px] active:bg-coolGray-200 hover:bg-coolGray-100"
                  >
                    <MenuItemLabel className="text-base">
                      {t("common.selectMonth")}
                    </MenuItemLabel>
                    <Icon as={CalendarDays} size="sm" className="ml-3" />
                  </MenuItem>
                  {/* {onCopyToNextYear && (
                    <MenuItem
                      key="copyToNextYear"
                      textValue="copyToNextYear"
                      backgroundColor="#fff"
                      display="flex"
                      justifyContent="space-between"
                      p="$3"
                      mb="$px"
                      minHeight={48}
                      onPress={() => onCopyToNextYear(item)}
                      sx={{
                        ":active": {
                          backgroundColor: "$coolGray200",
                        },
                        ":hover": {
                          backgroundColor: "$coolGray100",
                        },
                      }}
                    >
                      <MenuItemLabel className="text-base">
                        {t("common.copyToNextYear")}
                      </MenuItemLabel>
                      <Icon as={Copy} size="sm" ml="$3" />
                    </MenuItem>
                  )} */}
                  <MenuSeparator />
                  <MenuItem
                    key="delete"
                    textValue="delete"
                    onPress={() => onDelete(item)}
                    className="rounded-b-lg bg-[#fff] flex justify-between p-3 min-h-[48px] active:bg-red-100 hover:bg-red-50"
                  >
                    <MenuItemLabel className="text-base text-red-600">
                      {t("common.delete")}
                    </MenuItemLabel>
                    <Icon as={Trash2} size="sm" className="ml-3 text-red-600" />
                  </MenuItem>
                </Menu>
              </HStack>
              {index !== array.length - 1 && <Divider />}
            </Fragment>
          );
        })}
      </VStack>
    </ScrollView>
  );
}
