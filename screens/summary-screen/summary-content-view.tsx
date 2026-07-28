import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ActionButtons } from "../../components/common";
import { TaskContext } from "../../types/types";

interface ContentViewProps {
  text: string;
  context: TaskContext;
  onEdit: () => void;
  onDelete: () => void;
}

export const ContentView = memo(
  ({ text, onEdit, onDelete }: ContentViewProps) => {
    const { t } = useTranslation();

    return (
      <Box>
        <Box className="mb-2">
          <Text>{text || t("common.empty")}</Text>
        </Box>
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </Box>
    );
  }
);

ContentView.displayName = "ContentView";
