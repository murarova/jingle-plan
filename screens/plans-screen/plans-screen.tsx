import { useState } from "react";
import { EmptyScreen } from "../../components/empty-screen";
import { Loader } from "../../components/common";
import { usePlansScreen } from "../../components/plans-view/hooks/usePlansScreen";
import { ButtonIcon, Fab, SafeAreaView } from "@gluestack-ui/themed";
import { PlansViewOptions } from "../../constants/constants";
import { PlanContextData, TextData } from "../../types/types";
import { useAppSelector } from "../../store/withTypes";
import { Plus } from "lucide-react-native";
import { AddPlanModal } from "../../components/day-tasks/plans/add-plan-modal";
import { MonthSelectModal } from "../../components/modals/month-select-modal";
import { ViewSwitch } from "./view-switch";
import { GlobalGoal } from "./global-goal";
import { PlansView } from "./plans-view";
import { useGetUserDataQuery } from "../../services/api";

export function PlansScreen() {
  const [view, setView] = useState<PlansViewOptions>(PlansViewOptions.context);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { selectedYear } = useAppSelector((state) => state.app);
  const { data: userData, isLoading } = useGetUserDataQuery(
    { uid: currentUser?.uid!, year: selectedYear },
    { skip: !currentUser?.uid || !selectedYear }
  );
  const plans = userData?.plans as PlanContextData | null;
  const globalGoal = userData?.goals as TextData | null;

  const plansProps = usePlansScreen({ plans });

  if (!plans && !globalGoal) {
    return <EmptyScreen />;
  }

  return (
    <SafeAreaView flex={1}>
      {isLoading && <Loader absolute />}
      {plans && <ViewSwitch onViewChange={setView} />}
      {globalGoal && <GlobalGoal text={globalGoal.text} />}
      {plans && (
        <PlansView plans={plans} plansProps={plansProps} viewType={view} />
      )}
      <Fab
        size="lg"
        placement="bottom right"
        onPress={() => {
          plansProps.setShowModal(true);
        }}
      >
        <ButtonIcon as={Plus} />
      </Fab>
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
    </SafeAreaView>
  );
}
