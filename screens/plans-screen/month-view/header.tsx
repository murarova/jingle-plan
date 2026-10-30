import { Heading } from "@/ui/heading";
import { AccordionTitleText } from "@/ui/accordion";
import { memo } from "react";
import { CategoryToggle } from "@/components/common/category-toggle";

interface AccordionHeaderContentProps {
  monthName: string;
  isExpanded: boolean;
}

export const AccordionHeaderContent = memo(
  ({ monthName, isExpanded }: AccordionHeaderContentProps) => (
    <>
      <AccordionTitleText>
        <Heading size="md" className="text-primaryText">
          {monthName}
        </Heading>
      </AccordionTitleText>
      <CategoryToggle isExpanded={isExpanded} />
    </>
  ),
);

AccordionHeaderContent.displayName = "PlansMonthAccordionHeaderContent";
