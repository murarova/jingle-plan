import { Heading } from "@/components/ui/heading";
import { ScrollView } from "@/components/ui/scroll-view";
import { Divider } from "@/components/ui/divider";
import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "@/components/ui/menu";
import { Button, ButtonIcon } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
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
    <ScrollView className="max-h-80 w-full">
      <VStack space="sm" className="w-full flex-1">
        {title && <Heading size="sm">{title}</Heading>}
        {(plans ?? []).map((item, index, array) => {
          return (
            <Fragment key={item.id}>
              <HStack className="justify-between items-center">
                <Box className="flex-1">
                  <Text>{item?.text}</Text>
                </Box>
                <Menu
                  placement="top"
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Box className="px-3">
                        <Button
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
                      </Box>
                    );
                  }}
                  className="mr-2"
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
