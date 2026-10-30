import { Heading } from "@/ui/heading";
import { ScrollView } from "@/ui/scroll-view";
import { Divider } from "@/ui/divider";
import { Menu, MenuItem, MenuSeparator } from "@/ui/menu";
import { Button, ButtonIcon } from "@/ui/button";
import { VStack } from "@/ui/vstack";
import { HStack } from "@/ui/hstack";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { colors } from "@/constants/colors";
import { Ellipsis } from "lucide-react-native";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { PlanData } from "@/types";
import * as Haptics from "expo-haptics";

const menuSurfaceStyle = {
  width: 223,
  borderRadius: 16,
  paddingVertical: 0,
  overflow: "visible" as const,
  shadowColor: "#2B211A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 10,
  elevation: 6,
};

const actionItemClass =
  "bg-ivory-card px-4 py-[13px] data-[active=true]:bg-ivory-badge";

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
                  placement="bottom right"
                  offset={6}
                  style={menuSurfaceStyle}
                  trigger={(triggerProps) => (
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
                  )}
                >
                  <MenuItem
                    key="edit"
                    textValue="edit"
                    onPress={() => onEdit(item)}
                    className={`${actionItemClass} rounded-b-none rounded-t-2xl`}
                  >
                    <Box
                      pointerEvents="none"
                      className="absolute -top-[5px] right-[18px] h-2.5 w-2.5 bg-ivory-card"
                      style={{ transform: [{ rotate: "45deg" }] }}
                    />
                    <Text>{t("common.edit")}</Text>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    key="delete"
                    textValue="delete"
                    onPress={() => onDelete(item)}
                    className={`${actionItemClass} rounded-b-2xl rounded-t-none`}
                  >
                    <Text style={{ color: colors.primary500 }}>
                      {t("common.delete")}
                    </Text>
                  </MenuItem>
                </Menu>
              </HStack>
              {index !== array.length - 1 && (
                <Divider className="w-full bg-ivory-line" />
              )}
            </Fragment>
          );
        })}
      </VStack>
    </ScrollView>
  );
}
