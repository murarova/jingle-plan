import { ReactNode } from "react";
import { Box } from "@/ui/box";
import { Text } from "@/ui/text";
import { typeRole } from "@/constants/typography";
import { Heading } from "@/ui/heading";

export function GuideStepHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <Box className="w-full items-center gap-2 pb-6">
      <Heading size="lg" className={"text-center text-primaryText"}>
        {title}
      </Heading>
      <Text className={`${typeRole.secondary} text-center text-secondaryText`}>
        {subtitle}
      </Text>
    </Box>
  );
}

export function GuideCard({ children }: { children: ReactNode }) {
  return (
    <Box className="w-full rounded-2xl border border-ivory-line bg-ivory-card p-4">
      {children}
    </Box>
  );
}

export function GuideHeadline({ children }: { children: string }) {
  return (
    <Text className={`${typeRole.button} text-center text-primaryText pb-2`}>
      {children}
    </Text>
  );
}

export function GuideFooterText({ children }: { children: string }) {
  return (
    <Text className={`${typeRole.secondary} text-center text-secondaryText`}>
      {children}
    </Text>
  );
}
