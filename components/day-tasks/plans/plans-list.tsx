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
} from "@gluestack-ui/themed";
import { EditIcon, Trash2, Ellipsis } from "lucide-react-native";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { PlanData } from "../../../types/types";
import * as Haptics from "expo-haptics";

interface PlansListProps {
  plans: PlanData[] | null;
  title: string;
  onEdit: (plan: PlanData) => void;
  onDelete: (plan: PlanData) => void;
}

export function PlansList({ plans, onEdit, onDelete, title }: PlansListProps) {
  const { t } = useTranslation();

  return (
    <ScrollView maxHeight="$80" w="$80">
      <VStack width="100%" flex={1} space="sm">
        {title && <Heading size="sm">{title}</Heading>}
        {(plans ?? []).map((item, index, array) => {
          return (
            <Fragment key={item.id}>
              <HStack justifyContent="space-between" alignItems="center">
                <Box flex={1}>
                  <Text>{item?.text}</Text>
                </Box>
                <Menu
                  placement="top"
                  paddingVertical={0}
                  backgroundColor="$backgroundLight200"
                  mr="$2"
                  shadowColor="$black"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.25}
                  shadowRadius={3.84}
                  elevation={5}
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Box paddingHorizontal="$3">
                        <Button
                          variant="link"
                          {...triggerProps}
                          onPress={(e) => {
                            try {
                              Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                              );
                            } catch {}
                            triggerProps.onPress?.(e);
                          }}
                        >
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
                    key="delete"
                    mb="$px"
                    textValue="delete"
                    backgroundColor="#fff"
                    display="flex"
                    justifyContent="space-between"
                    p="$3"
                    minHeight={48}
                    borderBottomLeftRadius="$lg"
                    borderBottomRightRadius="$lg"
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
