import { useState } from "react";
import {
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  Textarea,
  TextareaInput,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  Button,
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  FormControlErrorText,
  KeyboardAvoidingView,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { PlanData, PlanScreenData, TaskContext } from "../../../types/types";
import { allMonths, TASK_CONTEXT } from "../../../constants/constants";
import { Platform } from "react-native";

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
  const [text, setText] = useState(data?.text ?? "");
  const [contextError, setContextError] = useState(false);

  const isEditMode = Boolean(data);

  function handleSubmit() {
    const trimmedText = text.trim();

    if (!trimmedText) return;

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

    setText("");
    closeModal();
  }

  function handleContextChange(value: string) {
    setContext && setContext(value as TaskContext);
    if (contextError) {
      setContextError(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : "height"}
      style={{ flex: 1, zIndex: 999 }}
    >
      <Modal isOpen onClose={closeModal}>
        <ModalBackdrop />
        <ModalContent width="90%">
          <ModalHeader mb={10}>
            <Text>
              {isEditMode
                ? t("screens.plansModal.editPlanTitle")
                : t("screens.plansModal.addPlanTitle")}
            </Text>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Textarea w="100%" size="md">
                <TextareaInput
                  onChangeText={setText}
                  defaultValue={text}
                  placeholder={t("screens.plansModal.placeholder")}
                />
              </Textarea>
              {isPlanScreen && (
                <>
                  <VStack space="xs">
                    <Select
                      selectedValue={t(`context.${context}`)}
                      onValueChange={handleContextChange}
                    >
                      <SelectTrigger bg="$white">
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
                          {Object.values(TASK_CONTEXT).map((context) => (
                            <SelectItem
                              key={context}
                              label={t(`context.${context}`)}
                              value={context}
                            />
                          ))}
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
                    <SelectTrigger bg="$white">
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
                        {[...allMonths, "every"].map((month) => (
                          <SelectItem
                            key={month}
                            label={t(`months.${month}`)}
                            value={month}
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="sm" mr="$3" onPress={closeModal}>
              <ButtonText>{t("common.cancel")}</ButtonText>
            </Button>
            <Button variant="solid" action="primary" onPress={handleSubmit}>
              <ButtonText>
                {isEditMode ? t("common.save") : t("common.add")}
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </KeyboardAvoidingView>
  );
}
