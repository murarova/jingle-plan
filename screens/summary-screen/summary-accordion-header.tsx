import { ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon";
import { AccordionTitleText, AccordionIcon } from "@/components/ui/accordion";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { memo } from "react";
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
