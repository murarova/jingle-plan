import { Box } from "@/ui/box";
import { Text } from "@/ui/text";
import { useMemo, useState } from "react";
import { EmptyScreen } from "../../components/common/empty-screen";
import { usePlansScreen } from "./hooks/usePlansScreen";
import { PlansViewOptions } from "@/constants";
import { GoalsData, PlanContextData } from "@/types";
import { useAppSelector } from "../../store/withTypes";
import { AddPlanModal } from "../../components/day-tasks/plans/add-plan-modal";
import { MonthSelectModal } from "../../components/modals/month-select-modal";
import { ViewSwitch } from "./components/view-switch";
import { GlobalGoal } from "./components/global-goal";
import { PlansView } from "./plans-view";
import { PlansAddButton } from "./components/plans-add-button";
import { PlansSearch } from "./components/plans-search";
import { usePlansSearch } from "./plans-search-context";
import { useGetUserDataQuery } from "../../services/api";
import { useTranslation } from "react-i18next";

export function PlansScreen() {
  const [view, setView] = useState<PlansViewOptions>(PlansViewOptions.context);
  const { query, setQuery, searchOpen } = usePlansSearch();
  const { t } = useTranslation();

  const { currentUser } = useAppSelector((state) => state.auth);
  const { selectedYear } = useAppSelector((state) => state.app);
  const { data: userData } = useGetUserDataQuery(
    { uid: currentUser?.uid!, year: selectedYear },
    { skip: !currentUser?.uid || !selectedYear },
  );
  const plans = userData?.plans as PlanContextData | null;
  const goalsData = userData?.goals as GoalsData | null;
  const globalGoal = goalsData?.globalGoal ?? null;

  const plansProps = usePlansScreen({ plans });
  const normalizedQuery = query.trim().toLowerCase();

  const filteredPlansProps = useMemo(() => {
    if (!normalizedQuery) return plansProps;

    const contextEntries = plansProps.contextEntries
      .map((entry) => ({
        ...entry,
        plans: entry.plans.filter((plan) =>
          plan.text?.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((entry) => entry.plans.length);

    const monthlyPlans = Object.fromEntries(
      Object.entries(plansProps.monthlyPlans)
        .map(([month, monthPlans]) => [
          month,
          monthPlans.filter((plan) =>
            plan.text?.toLowerCase().includes(normalizedQuery),
          ),
        ])
        .filter(([, monthPlans]) => monthPlans.length),
    );

    return { ...plansProps, contextEntries, monthlyPlans };
  }, [normalizedQuery, plansProps]);

  const hasPlanItems = plansProps.contextEntries.length > 0;
  const hasVisiblePlans =
    view === PlansViewOptions.context
      ? filteredPlansProps.contextEntries.length > 0
      : Object.keys(filteredPlansProps.monthlyPlans).length > 0;

  const searchExpandedKey =
    !normalizedQuery || !hasVisiblePlans
      ? ""
      : `${normalizedQuery}\n${
          view === PlansViewOptions.context
            ? filteredPlansProps.contextEntries
                .map((entry) => entry.context)
                .join("\0")
            : Object.keys(filteredPlansProps.monthlyPlans).join("\0")
        }`;

  if (!plans && !globalGoal) {
    return <EmptyScreen />;
  }

  return (
    <Box className="flex-1">
      {plans && <ViewSwitch onViewChange={setView} />}
      {hasPlanItems && searchOpen && (
        <Box className="px-4 pb-4 pt-2">
          <PlansSearch value={query} onChangeText={setQuery} autoFocus />
        </Box>
      )}
      {globalGoal && selectedYear && (
        <GlobalGoal text={globalGoal.text} year={selectedYear} />
      )}
      {plans && hasVisiblePlans && (
        <PlansView
          plansProps={filteredPlansProps}
          viewType={view}
          searchExpandedKey={searchExpandedKey}
        />
      )}
      {plans && !hasVisiblePlans && (
        <Box className="px-4 pt-6">
          <Text className="text-center text-secondaryText">
            {t("screens.plansScreen.noSearchResults")}
          </Text>
        </Box>
      )}
      <PlansAddButton onPress={() => plansProps.setShowModal(true)} />
      {plansProps.showModal && (
        <AddPlanModal
          isPlanScreen
          closeModal={plansProps.closeModal}
          data={plansProps.updatedData}
          context={plansProps.context}
          selectedMonth={plansProps.selectedMonth}
          setSelectedMonth={plansProps.setSelectedMonth}
          setContext={plansProps.setContext}
          handleUpdatePlan={plansProps.handleUpdatePlan}
          handleAddPlan={plansProps.handleAddPlan}
        />
      )}
      <MonthSelectModal
        sheetRef={plansProps.sheetRef}
        closeMonthModal={plansProps.closeMonthModal}
        onMonthSelect={plansProps.handleMonthSelect}
        month={plansProps.updatedData?.month}
      />
    </Box>
  );
}
