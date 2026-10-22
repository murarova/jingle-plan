import { FormControlErrorText } from "@/ui/form-control";
import { AutoGrowingTextarea } from "@/components/common";

import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
} from "@/ui/select";

import { ButtonText, Button } from "@/ui/button";
import { VStack } from "@/ui/vstack";
import { Text } from "@/ui/text";
import {
  ModalBody,
  ModalFooter,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
} from "@/ui/modal";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { KeyboardAvoidingView } from "@/ui/keyboard-avoiding-view";
import { PlanData, PlanScreenData, TaskContext } from "@/types";
import { allMonths, TASK_CONTEXT } from "@/constants";

interface AddPlanModalProps {
  isPlanScreen?: boolean;
  closeModal: () => void;
  data: PlanScreenData | PlanData | null;
  context?: TaskContext | null;
  setContext?: (context: TaskContext) => void;
  selectedMonth?: string;
  setSelectedMonth?: (month: string) => void;
  handleAddPlan: (text: string, context?: TaskContext, month?: string) => void;
  handleUpdatePlan: (id: string, text: string) => void;
}

export function AddPlanModal({
  isPlanScreen,
  closeModal,
  handleAddPlan,
  data,
  handleUpdatePlan,
  context,
  setContext,
  selectedMonth,
  setSelectedMonth,
}: AddPlanModalProps) {
  const { t } = useTranslation();
  const textRef = useRef(data?.text ?? "");
  const [contextError, setContextError] = useState(false);

  const isEditMode = Boolean(data);

  const handleTextChange = useCallback((value: string) => {
    textRef.current = value;
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedText = textRef.current.trim();

    if (!trimmedText) {
      Alert.alert(t("common.error"), t("errors.emptyText"));
      return;
    }

    if (isPlanScreen && !isEditMode && !context) {
      setContextError(true);
      return;
    }

    if (isEditMode && data?.id) {
      handleUpdatePlan(data.id, trimmedText);
    } else if (isPlanScreen && context) {
      handleAddPlan(trimmedText, context, selectedMonth);
    } else if (!isPlanScreen) {
      handleAddPlan(trimmedText);
    }

    textRef.current = "";
    closeModal();
  }, [
    closeModal,
    context,
    data,
    handleAddPlan,
    handleUpdatePlan,
    isEditMode,
    isPlanScreen,
    selectedMonth,
    t,
  ]);

  function handleContextChange(value: string) {
    setContext && setContext(value as TaskContext);
    if (contextError) {
      setContextError(false);
    }
  }

  return (
    <Modal isOpen onClose={closeModal}>
      <ModalBackdrop />
      <KeyboardAvoidingView
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        behavior="padding"
      >
        <ModalContent className="w-[90%]" entering={undefined}>
          <ModalHeader className="mb-[10px]">
            <Text>
              {isEditMode
                ? t("screens.plansModal.editPlanTitle")
                : t("screens.plansModal.addPlanTitle")}
            </Text>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <AutoGrowingTextarea
                defaultValue={data?.text ?? ""}
                onChangeText={handleTextChange}
                placeholder={t("screens.plansModal.placeholder")}
                onSubmitEditing={handleSubmit}
              />
              {isPlanScreen && (
                <>
                  <VStack space="xs">
                    <Select
                      selectedValue={context ? t(`context.${context}`) : ""}
                      onValueChange={handleContextChange}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectInput
                          placeholder={t("screens.plansModal.selectContext")}
                        />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectScrollView>
                            {Object.values(TASK_CONTEXT).map((context) => (
                              <SelectItem
                                key={context}
                                label={t(`context.${context}`)}
                                value={context}
                              />
                            ))}
                          </SelectScrollView>
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                    {contextError && (
                      <FormControlErrorText>
                        {t("screens.plansModal.contextRequired")}
                      </FormControlErrorText>
                    )}
                  </VStack>
                  <Select
                    selectedValue={
                      selectedMonth ? t(`months.${selectedMonth}`) : ""
                    }
                    onValueChange={setSelectedMonth}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectInput
                        placeholder={t("screens.plansModal.selectMonth")}
                      />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectScrollView>
                          {allMonths.map((month) => (
                            <SelectItem
                              key={month}
                              label={t(`months.${month}`)}
                              value={month}
                            />
                          ))}
                          <SelectItem
                            key="every"
                            label={t("monthSelect.everyMonth")}
                            value="every"
                          />
                        </SelectScrollView>
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onPress={closeModal} className="mr-3">
              <ButtonText>{t("common.cancel")}</ButtonText>
            </Button>
            <Button variant="default" onPress={handleSubmit}>
              <ButtonText>
                {isEditMode ? t("common.save") : t("common.add")}
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </KeyboardAvoidingView>
    </Modal>
  );
}
