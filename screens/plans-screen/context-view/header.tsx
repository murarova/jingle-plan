import { Heading } from "@/ui/heading";
import { AccordionTitleText } from "@/ui/accordion";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "@/types";
import { CategoryToggle } from "@/components/common/category-toggle";

interface AccordionHeaderContentProps {
  context: TaskContext;
  isExpanded: boolean;
}

export const AccordionHeaderContent = memo(
  ({ context, isExpanded }: AccordionHeaderContentProps) => {
    const { t } = useTranslation();

    return (
      <>
        <AccordionTitleText>
          <Heading size="md" className="text-primaryText">
            {t(`context.${context}`)}
          </Heading>
        </AccordionTitleText>
        <CategoryToggle isExpanded={isExpanded} />
      </>
    );
  },
);

AccordionHeaderContent.displayName = "PlansContextAccordionHeaderContent";
