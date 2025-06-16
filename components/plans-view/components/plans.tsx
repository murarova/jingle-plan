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
  Heading,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckIcon,
  CheckboxLabel,
  Badge,
  BadgeText,
  BadgeIcon,
} from "@gluestack-ui/themed";
import { EditIcon, Trash2, Ellipsis, CalendarDays } from "lucide-react-native";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { months, PlansViewOptions } from "../../../constants/constants";
import { PlanScreenData } from "../../../types/types";

interface PlansListProps {
  plans: PlanScreenData[];
  onEdit: (plan: PlanScreenData) => void;
  onDelete: (plan: PlanScreenData) => void;
  onMonthSelect: (plan: PlanScreenData) => void;
  handleCompletePlan: (plan: PlanScreenData, value: boolean) => void;
  view?: PlansViewOptions;
}

export function PlansList({
  plans,
  onEdit,
  onDelete,
  handleCompletePlan,
  onMonthSelect,
  view,
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
                    defaultIsChecked={item?.isDone}
                    onChange={(value) => handleCompletePlan(item, value)}
                    size="md"
                    aria-label={item?.text}
                  >
                    <CheckboxIndicator mr="$2">
                      <CheckboxIcon color="$white" as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel flex={1}>
                      <Text
                        style={
                          item?.isDone && {
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
                    onPress={() => onEdit(item)}
                  >
                    <MenuItemLabel size="sm">{t("common.edit")}</MenuItemLabel>
                    <Icon as={EditIcon} size="sm" ml="$2" />
                  </MenuItem>

                  <MenuItem
                    key="delete"
                    mb="$px"
                    textValue="delete"
                    backgroundColor="#fff"
                    display="flex"
                    justifyContent="space-between"
                    onPress={() => onDelete(item)}
                  >
                    <MenuItemLabel size="sm">
                      {t("common.delete")}
                    </MenuItemLabel>
                    <Icon as={Trash2} size="sm" ml="$2" />
                  </MenuItem>
                  <MenuItem
                    key="selectMonth"
                    textValue="selectMonth"
                    backgroundColor="#fff"
                    display="flex"
                    justifyContent="space-between"
                    onPress={() => onMonthSelect(item)}
                  >
                    <MenuItemLabel size="sm">
                      {t("common.selectMonth")}
                    </MenuItemLabel>
                    <Icon as={CalendarDays} size="sm" ml="$2" />
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
