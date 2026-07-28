import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { memo } from "react";
import { ActionButtons } from "../../common";

interface GoalsViewProps {
  text: string;
  emptyText: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const GoalsView = memo(
  ({ text, emptyText, onEdit, onDelete }: GoalsViewProps) => (
    <Box>
      <Box className="mb-2">
        <Text>{text || emptyText}</Text>
      </Box>
      <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    </Box>
  )
);

GoalsView.displayName = "GoalsView";
