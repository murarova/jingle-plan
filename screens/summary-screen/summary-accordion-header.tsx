import { ChevronUpIcon, ChevronDownIcon } from "@/ui/icon";
import { AccordionTitleText, AccordionIcon } from "@/ui/accordion";
import { Heading } from "@/ui/heading";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { memo } from "react";
import { TaskContext, SummaryContextData } from "@/types";

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
        <Box className="flex flex-row items-center">
          <Box className="mr-2">
            <Heading size="sm">{t(`context.${context}`)}</Heading>
          </Box>
          <Box className="flex items-center">
            <Text>{getRating(summary?.[context]?.rate)?.icon}</Text>
          </Box>
        </Box>
      </AccordionTitleText>
      <AccordionIcon
        as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
        className="ml-3"
      />
    </>
  )
);

AccordionHeaderContent.displayName = "AccordionHeaderContent";
