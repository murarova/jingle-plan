import { memo } from "react";
import {
  Box,
  Text,
  Heading,
  AccordionTitleText,
  AccordionIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@gluestack-ui/themed";
import { TaskContext, SummaryContextData } from "../../types/types";

interface AccordionHeaderProps {
  context: TaskContext;
  isExpanded: boolean;
  getRating: (rate?: number) => { icon: string } | undefined;
  t: (key: string) => string;
  summary: SummaryContextData | null;
}

export const AccordionHeaderContent = memo(
  ({ context, isExpanded, getRating, t, summary }: AccordionHeaderProps) => (
    <>
      <AccordionTitleText>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box mr="$2">
            <Heading size="sm">{t(`context.${context}`)}</Heading>
          </Box>
          <Box display="flex" alignItems="center">
            <Text>{getRating(summary?.[context]?.rate)?.icon}</Text>
          </Box>
        </Box>
      </AccordionTitleText>
      <AccordionIcon
        as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
        ml="$3"
      />
    </>
  )
);

AccordionHeaderContent.displayName = "AccordionHeaderContent";
