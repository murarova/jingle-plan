import { Box, Button, ButtonText } from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import { AddPlanModal } from "./add-plan-modal";
import { PlansList } from "./plans-list";
import { usePlans } from "./hooks/usePlans";
import { PlanContextData, PlanData } from "../../../types/types";

interface PlansProps {
  context: string;
  data: PlanContextData | null;
}

export function Plans({ context, data }: PlansProps) {
  const { t } = useTranslation();

  const contextData = data?.[context] as PlanData[] | null;

  const {
    updatedData,
    showModal,
    setShowModal,
    handleAddPlan,
    handleUpdatePlan,
    handleEditPlan,
    handleDeletePlan,
    handleAddPlanBtn,
    isLoading,
  } = usePlans({
    data: contextData,
    context,
  });

  return (
    <Box>
      <Button borderRadius="$lg" onPress={handleAddPlanBtn}>
        <ButtonText>{t("screens.tasksOfTheDay.addPlanItem")}</ButtonText>
      </Button>
      {!isEmpty(data) && (
        <Box mt="$10">
          <PlansList
            plans={contextData}
            title={t("screens.plansScreen.title")}
            onEdit={handleEditPlan}
            onDelete={handleDeletePlan}
          />
        </Box>
      )}

      {showModal && (
        <AddPlanModal
          data={updatedData}
          setShowModal={setShowModal}
          handleUpdatePlan={handleUpdatePlan}
          handleAddPlan={handleAddPlan}
        />
      )}
    </Box>
  );
}
