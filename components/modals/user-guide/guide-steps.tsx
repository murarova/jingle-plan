import { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import {
  BookHeart,
  BookOpen,
  CalendarDays,
  ChartNoAxesColumn,
  CircleCheck,
  CirclePlay,
  Images,
  ListChecks,
  Sun,
} from "lucide-react-native";
import { Box } from "@/ui/box";
import { Text } from "@/ui/text";
import { colors } from "@/constants/colors";
import { typeRole } from "@/constants/typography";
import {
  GuideCard,
  GuideFooterText,
  GuideHeadline,
  GuideStepHeader,
} from "./guide-primitives";

const GREEN_TINT = `${colors.green400}26`;
const SAMPLE_DAYS = [1, 2, 3, 4, 5, 6, 7];
const ACTIVE_SAMPLE_DAY = 4;
const SAMPLE_PROGRESS = 66;

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

function GuideIconRow({
  Icon,
  title,
  description,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Box className="flex-row items-center gap-3 rounded-2xl border border-ivory-line bg-ivory-card p-3">
      <Box
        className="h-12 w-12 items-center justify-center rounded-[14px]"
        style={{ backgroundColor: GREEN_TINT }}
      >
        <Icon size={22} color={colors.green400} />
      </Box>
      <Box className="flex-1 gap-0.5">
        <Text className={`${typeRole.button} text-primaryText`}>{title}</Text>
        <Text className={`${typeRole.supporting} text-secondaryText`}>
          {description}
        </Text>
      </Box>
    </Box>
  );
}

function GuideListRow({
  Icon,
  title,
  description,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Box className="flex-row items-center gap-3 py-3">
      <Icon size={22} color={colors.green400} />
      <Box className="flex-1 gap-0.5">
        <Text className={`${typeRole.button} text-primaryText`}>{title}</Text>
        <Text className={`${typeRole.supporting} text-secondaryText`}>
          {description}
        </Text>
      </Box>
    </Box>
  );
}

function CalendarStep() {
  const { t } = useTranslation();

  return (
    <Box className="w-full items-center gap-6">
      <GuideStepHeader
        title={t("guide.calendar.title")}
        subtitle={t("guide.calendar.subtitle")}
      />
      <CalendarDays size={40} color={colors.green400} />
      <GuideHeadline>{t("guide.calendar.headline")}</GuideHeadline>
      <GuideCard>
        <Box className="items-center gap-3">
          <Box className="w-full flex-row justify-between">
            {SAMPLE_DAYS.map((day) => {
              const isActive = day === ACTIVE_SAMPLE_DAY;

              return (
                <Box
                  key={day}
                  className="h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isActive
                      ? colors.green400
                      : colors.ivoryBadge,
                  }}
                >
                  <Text
                    className={`${typeRole.supporting} ${
                      isActive ? "text-white" : "text-primaryText"
                    }`}
                  >
                    {day}
                  </Text>
                </Box>
              );
            })}
          </Box>
          <Text
            className={`${typeRole.secondary} text-center text-primaryText`}
          >
            {t("guide.calendar.hint")}
          </Text>
        </Box>
      </GuideCard>
      <GuideFooterText>{t("guide.calendar.footer")}</GuideFooterText>
    </Box>
  );
}

function DailyStep() {
  const { t } = useTranslation();

  return (
    <Box className="w-full items-center gap-4">
      <GuideStepHeader
        title={t("guide.daily.title")}
        subtitle={t("guide.daily.subtitle")}
      />
      <GuideIconRow
        Icon={CirclePlay}
        title={t("guide.daily.inspirationTitle")}
        description={t("guide.daily.inspirationText")}
      />
      <GuideIconRow
        Icon={CircleCheck}
        title={t("guide.daily.taskTitle")}
        description={t("guide.daily.taskText")}
      />
      <GuideIconRow
        Icon={Sun}
        title={t("guide.daily.moodTitle")}
        description={t("guide.daily.moodText")}
      />
      <Box
        className="w-full items-center gap-2 rounded-2xl p-4"
        style={{ backgroundColor: GREEN_TINT }}
      >
        <CircleCheck size={22} color={colors.green400} />
        <Text className={`${typeRole.button} text-primaryText`}>
          {t("guide.daily.completed")}
        </Text>
      </Box>
      <GuideFooterText>{t("guide.daily.footer")}</GuideFooterText>
    </Box>
  );
}

function SaveStep() {
  const { t } = useTranslation();

  return (
    <Box className="w-full items-center gap-5">
      <GuideStepHeader
        title={t("guide.save.title")}
        subtitle={t("guide.save.subtitle")}
      />
      <BookHeart size={40} color={colors.green400} />
      <GuideCard>
        <GuideListRow
          Icon={BookOpen}
          title={t("guide.save.summaryTitle")}
          description={t("guide.save.summaryText")}
        />
        <Box className="h-px w-full bg-ivory-line" />
        <GuideListRow
          Icon={Images}
          title={t("guide.save.albumTitle")}
          description={t("guide.save.albumText")}
        />
        <Box className="h-px w-full bg-ivory-line" />
        <GuideListRow
          Icon={ListChecks}
          title={t("guide.save.plansTitle")}
          description={t("guide.save.plansText")}
        />
      </GuideCard>
      <GuideFooterText>{t("guide.save.footer")}</GuideFooterText>
    </Box>
  );
}

function ProgressStep() {
  const { t } = useTranslation();
  const goals = [
    { label: t("guide.progress.goalOne"), isDone: true },
    { label: t("guide.progress.goalTwo"), isDone: true },
    { label: t("guide.progress.goalThree"), isDone: false },
  ];

  return (
    <Box className="w-full items-center gap-5">
      <GuideStepHeader
        title={t("guide.progress.title")}
        subtitle={t("guide.progress.subtitle")}
      />
      <ChartNoAxesColumn size={40} color={colors.green400} />
      <GuideHeadline>{t("guide.progress.headline")}</GuideHeadline>
      <GuideCard>
        <Box className="gap-3">
          <Text className={`${typeRole.button} text-primaryText`}>
            {t("guide.progress.cardTitle")}
          </Text>
          {goals.map((goal) => (
            <Box key={goal.label} className="flex-row items-center gap-3">
              {goal.isDone ? (
                <CircleCheck size={20} color={colors.green400} />
              ) : (
                <Box
                  className="h-5 w-5 rounded-full"
                  style={{ backgroundColor: colors.green400 }}
                />
              )}
              <Text className={`${typeRole.body} flex-1 text-primaryText`}>
                {goal.label}
              </Text>
            </Box>
          ))}
          <Box
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: GREEN_TINT }}
          >
            <Box
              className="h-full rounded-full"
              style={{
                width: `${SAMPLE_PROGRESS}%`,
                backgroundColor: colors.green400,
              }}
            />
          </Box>
          <Text
            className={`${typeRole.supporting} text-center text-secondaryText`}
          >
            {t("guide.progress.example")}
          </Text>
        </Box>
      </GuideCard>
      <GuideFooterText>{t("guide.progress.footer")}</GuideFooterText>
    </Box>
  );
}

export const GUIDE_STEPS: ComponentType[] = [
  CalendarStep,
  DailyStep,
  SaveStep,
  ProgressStep,
];
