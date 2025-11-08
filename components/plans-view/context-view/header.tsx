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
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../../types/types";

interface AccordionHeaderContentProps {
  context: TaskContext;
  isExpanded: boolean;
  plansCount: number;
}

export const AccordionHeaderContent = memo(
  ({ context, isExpanded, plansCount }: AccordionHeaderContentProps) => {
    const { t } = useTranslation();

    return (
      <>
        <AccordionTitleText>
          <Box flexDirection="row" alignItems="center">
            <Heading size="sm" mr="$2">
              {t(`context.${context}`)}
            </Heading>
            <Text>({plansCount})</Text>
          </Box>
        </AccordionTitleText>
        <AccordionIcon
          as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
          ml="$3"
        />
      </>
    );
  }
) ;

AccordionHeaderContent.displayName = "PlansContextAccordionHeaderContent";

