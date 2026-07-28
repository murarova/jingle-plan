import { ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { AccordionTitleText, AccordionIcon } from "@/components/ui/accordion";
import { memo } from "react";

interface AccordionHeaderContentProps {
  monthName: string;
  plansCount: number;
  isExpanded: boolean;
}

export const AccordionHeaderContent = memo(
  ({ monthName, plansCount, isExpanded }: AccordionHeaderContentProps) => (
    <>
      <AccordionTitleText>
        <Box className="flex-row items-center">
          <Heading size="sm" className="mr-2">
            {monthName}
          </Heading>
          <Text>({plansCount})</Text>
        </Box>
      </AccordionTitleText>
      <AccordionIcon
        as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
        className="ml-3"
      />
    </>
  )
);

AccordionHeaderContent.displayName = "PlansMonthAccordionHeaderContent";

