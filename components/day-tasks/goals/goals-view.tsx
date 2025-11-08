import { memo } from "react";
import { Box, Text } from "@gluestack-ui/themed";
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
      <Box mb="$2">
        <Text>{text || emptyText}</Text>
      </Box>
      <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    </Box>
  )
);

GoalsView.displayName = "GoalsView";
