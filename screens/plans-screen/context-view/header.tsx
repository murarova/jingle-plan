import { ChevronUpIcon, ChevronDownIcon } from "@/ui/icon";
import { Text } from "@/ui/text";
import { Heading } from "@/ui/heading";
import { Box } from "@/ui/box";
import { AccordionTitleText, AccordionIcon } from "@/ui/accordion";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "@/types";

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
          <Box className="flex-row items-center">
            <Heading size="sm" className="mr-2">
              {t(`context.${context}`)}
            </Heading>
            <Text>({plansCount})</Text>
          </Box>
        </AccordionTitleText>
        <AccordionIcon
          as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
          className="ml-3"
        />
      </>
    );
  }
) ;

AccordionHeaderContent.displayName = "PlansContextAccordionHeaderContent";

