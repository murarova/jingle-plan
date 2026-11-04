import { ComponentType, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CalendarCheck, Images, Medal, Target } from "lucide-react-native";
import { Box } from "@/ui/box";
import { Text } from "@/ui/text";
import { colors } from "@/constants/colors";
import { typeRole } from "@/constants/typography";

type Benefit = {
  key: string;
  Icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
};

const BENEFITS: Benefit[] = [
  { key: "inspiration", Icon: CalendarCheck, color: colors.green400 },
  { key: "album", Icon: Images, color: colors.primary500 },
  { key: "summary", Icon: Medal, color: colors.progressYellow },
  { key: "plans", Icon: Target, color: colors.green400 },
];

export function PaywallBenefits() {
  const { t } = useTranslation();

  return (
    <Box className="w-full rounded-3xl border border-ivory-line bg-ivory-card px-4">
      {BENEFITS.map(({ key, Icon, color }, index) => (
        <Fragment key={key}>
          {index > 0 && <Box className="h-px w-full bg-ivory-line" />}
          <Box className="flex-row items-center gap-3 py-3">
            <Box
              className="h-11 w-11 items-center justify-center rounded-[14px]"
              style={{ backgroundColor: `${color}26` }}
            >
              <Icon size={22} color={color} />
            </Box>
            <Box className="flex-1 gap-0.5">
              <Text className={`${typeRole.button} text-primaryText`}>
                {t(`paywall.benefits.${key}.title`)}
              </Text>
              <Text className={`${typeRole.supporting} text-secondaryText`}>
                {t(`paywall.benefits.${key}.text`)}
              </Text>
            </Box>
          </Box>
        </Fragment>
      ))}
    </Box>
  );
}
