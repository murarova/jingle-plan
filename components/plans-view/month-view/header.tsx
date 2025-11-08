import { memo } from "react";
import {
  AccordionTitleText,
  AccordionIcon,
  Box,
  Heading,
  Text,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@gluestack-ui/themed";

interface AccordionHeaderContentProps {
  monthName: string;
  plansCount: number;
  isExpanded: boolean;
}

export const AccordionHeaderContent = memo(
  ({ monthName, plansCount, isExpanded }: AccordionHeaderContentProps) => (
    <>
      <AccordionTitleText>
        <Box flexDirection="row" alignItems="center">
          <Heading size="sm" mr="$2">
            {monthName}
          </Heading>
          <Text>({plansCount})</Text>
        </Box>
      </AccordionTitleText>
      <AccordionIcon
        as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
        ml="$3"
      />
    </>
  )
);

AccordionHeaderContent.displayName = "PlansMonthAccordionHeaderContent";

