import { AccordionTitleText } from "@/ui/accordion";
import { Heading } from "@/ui/heading";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { memo } from "react";
import { TaskContext, SummaryContextData } from "@/types";
import { CategoryToggle } from "@/components/common/category-toggle";

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
        <Box className="flex-row items-center">
          <Heading size="md" className="mr-2 text-primaryText">
            {t(`context.${context}`)}
          </Heading>
          <Text>{getRating(summary?.[context]?.rate)?.icon}</Text>
        </Box>
      </AccordionTitleText>
      <CategoryToggle isExpanded={isExpanded} />
    </>
  )
);

AccordionHeaderContent.displayName = "AccordionHeaderContent";
