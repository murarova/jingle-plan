import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  ButtonIcon,
  Menu,
  MenuItem,
  MenuItemLabel,
  Icon,
  Divider,
  ScrollView,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckIcon,
  CheckboxLabel,
  Badge,
  BadgeText,
  BadgeIcon,
} from "@gluestack-ui/themed";
import {
  EditIcon,
  Trash2,
  Ellipsis,
  CalendarDays,
  Copy,
} from "lucide-react-native";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { months, PlansViewOptions } from "../../../constants/constants";
import { PlanScreenData } from "../../../types/types";
import { CompletePlanProps } from "../plans-context-view";

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
    <ScrollView maxHeight="$80" w="$80">
      <VStack width="100%" flex={1} space="sm">
        {plans.map((item, index, array) => {
          const label = getMonthBadge(item);
          const isDone =
            Boolean(
              item.monthlyProgress?.find(
                (planMonth) => planMonth.month === month
              )?.isDone
            ) || item?.isDone;
          return (
            <Fragment key={item.id}>
              {view === PlansViewOptions.context && label && (
                <HStack>
                  <Badge
                    size="sm"
                    variant="outline"
                    borderRadius="$lg"
                    action="gray"
                  >
                    <BadgeText>{label}</BadgeText>
                    <BadgeIcon as={CalendarDays} ml="$2" />
                  </Badge>
                </HStack>
              )}
              {view === PlansViewOptions.month && (
                <HStack>
                  <Badge
                    size="sm"
                    variant="outline"
                    borderRadius="$lg"
                    action="gray"
                  >
                    <BadgeText>{t(`context.${item.context}`)}</BadgeText>
                  </Badge>
                </HStack>
              )}
              <HStack justifyContent="space-between" alignItems="center">
                <Box flex={1}>
                  <Checkbox
                    value={item?.text}
                    defaultIsChecked={isDone}
                    onChange={(value) =>
                      handleCompletePlan({
                        plan: item,
                        value,
                        context: item.context,
                        month,
                      })
                    }
                    size="md"
                    aria-label={item?.text}
                  >
                    <CheckboxIndicator mr="$2">
                      <CheckboxIcon color="$white" as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel flex={1}>
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
                  paddingVertical={0}
                  backgroundColor="$backgroundLight200"
                  borderRadius="$lg"
                  mr="$2"
                  shadowColor="$black"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.25}
                  shadowRadius={3.84}
                  elevation={5}
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Box>
                        <Button variant="link" {...triggerProps}>
                          <ButtonIcon color="$black" as={Ellipsis} />
                        </Button>
                      </Box>
                    );
                  }}
                >
                  <MenuItem
                    key="edit"
                    textValue="edit"
                    display="flex"
                    backgroundColor="#fff"
                    justifyContent="space-between"
                    mb="$px"
                    p="$3"
                    minHeight={48}
                    borderTopLeftRadius="$lg"
                    borderTopRightRadius="$lg"
                    onPress={() => onEdit(item)}
                    sx={{
                      ":active": {
                        backgroundColor: "$coolGray200",
                      },
                      ":hover": {
                        backgroundColor: "$coolGray100",
                      },
                    }}
                  >
                    <MenuItemLabel size="md">{t("common.edit")}</MenuItemLabel>
                    <Icon as={EditIcon} size="sm" ml="$3" />
                  </MenuItem>
                  <MenuItem
                    key="selectMonth"
                    textValue="selectMonth"
                    backgroundColor="#fff"
                    display="flex"
                    justifyContent="space-between"
                    p="$3"
                    mb="$px"
                    minHeight={48}
                    onPress={() => onMonthSelect(item)}
                    sx={{
                      ":active": {
                        backgroundColor: "$coolGray200",
                      },
                      ":hover": {
                        backgroundColor: "$coolGray100",
                      },
                    }}
                  >
                    <MenuItemLabel size="md">
                      {t("common.selectMonth")}
                    </MenuItemLabel>
                    <Icon as={CalendarDays} size="sm" ml="$3" />
                  </MenuItem>
                  {onCopyToNextYear && (
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
                      <MenuItemLabel size="md">
                        {t("common.copyToNextYear")}
                      </MenuItemLabel>
                      <Icon as={Copy} size="sm" ml="$3" />
                    </MenuItem>
                  )}
                  <MenuItem
                    key="delete"
                    mb="$px"
                    textValue="delete"
                    backgroundColor="#fff"
                    display="flex"
                    justifyContent="space-between"
                    p="$3"
                    borderBottomLeftRadius="$lg"
                    borderBottomRightRadius="$lg"
                    minHeight={48}
                    onPress={() => onDelete(item)}
                    sx={{
                      ":active": {
                        backgroundColor: "$red100",
                      },
                      ":hover": {
                        backgroundColor: "$red50",
                      },
                    }}
                  >
                    <MenuItemLabel size="md" color="$red600">
                      {t("common.delete")}
                    </MenuItemLabel>
                    <Icon as={Trash2} size="sm" ml="$3" color="$red600" />
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
