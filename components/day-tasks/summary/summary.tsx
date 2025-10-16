import { Box } from "@gluestack-ui/themed";
import { SummaryContextData } from "../../../types/types";
import { useSummary } from "./hooks/useSummary";
import { SummaryForm } from "./summary-form";
import { SummaryView } from "./summary-view";

interface SummaryProps {
  context: string;
  data: SummaryContextData | null;
}

export function Summary({ context, data }: SummaryProps) {
  const {
    isEditing,
    text,
    rate,
    handleTextChange,
    handleRateChange,
    handleEdit,
    handleCancel,
    handleSubmit,
    handleTaskRemove,
  } = useSummary({ context, data });

  return (
    <Box>
      {isEditing ? (
        <SummaryForm
          text={text}
          rate={rate}
          onTextChange={handleTextChange}
          onRateChange={handleRateChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <SummaryView
          text={text}
          rate={rate}
          onEdit={handleEdit}
          onDelete={handleTaskRemove}
        />
      )}
    </Box>
  );
}

Summary.displayName = "Summary";
