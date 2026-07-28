import { ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { AccordionTitleText, AccordionIcon } from "@/components/ui/accordion";
import { memo } from "react";
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

