import { Button, ButtonText } from "@/ui/button";
import { Box } from "@/ui/box";
import React from "react";
import { useTranslation } from "react-i18next";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  return (
    <Box className="mt-3">
      <Button onPress={onEdit} className="mt-2">
        <ButtonText>{t("screens.tasksOfTheDay.editBtnText")}</ButtonText>
      </Button>
      <Button onPress={onDelete} variant="outline" className="mt-2">
        <ButtonText>{t("common.delete")}</ButtonText>
      </Button>
    </Box>
  );
};
