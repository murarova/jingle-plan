import { FormControlErrorText } from "@/ui/form-control";
import { AppButton, AutoGrowingTextarea } from "@/components/common";
import { useModalKeyboardShift } from "@/hooks/useModalKeyboardShift";
import { bodyFontSize, systemFontFamily } from "@/constants/typography";
import { Heading } from "@/ui/heading";

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

import { VStack } from "@/ui/vstack";
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
import { Alert, View } from "react-native";
import { PlanData, PlanScreenData, TaskContext } from "@/types";
import { allMonths, TASK_CONTEXT, cardShadow } from "@/constants";

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
  const modalRef = useRef<View>(null);
  const translateY = useModalKeyboardShift(modalRef);
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
      <View
        ref={modalRef}
        pointerEvents="box-none"
        style={{
          width: "100%",
          alignItems: "center",
          transform: [{ translateY }],
        }}
      >
        <ModalContent
          entering={undefined}
          className="w-[90%] rounded-3xl border border-ivory-line bg-ivory-card"
          style={cardShadow}
        >
          <ModalHeader>
            <Heading size="md" className="text-primaryText mb-2">
              {isEditMode
                ? t("screens.plansModal.editPlanTitle")
                : t("screens.plansModal.addPlanTitle")}
            </Heading>
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
                      <SelectTrigger className="h-11 rounded-2xl border-ivory-line bg-ivory-card">
                        <SelectInput
                          className="text-primaryText placeholder:text-secondaryText"
                          placeholder={t("screens.plansModal.selectContext")}
                          style={{
                            fontFamily: systemFontFamily,
                            fontSize: bodyFontSize,
                            lineHeight: 22,
                          }}
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
                    <SelectTrigger className="h-11 rounded-2xl border-ivory-line bg-ivory-card">
                      <SelectInput
                        className="text-primaryText placeholder:text-secondaryText"
                        placeholder={t("screens.plansModal.selectMonth")}
                        style={{
                          fontFamily: systemFontFamily,
                          fontSize: bodyFontSize,
                          lineHeight: 22,
                        }}
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
          <ModalFooter className="w-full gap-3">
            <AppButton
              variant="secondary"
              label={t("common.cancel")}
              onPress={closeModal}
              className="min-w-0 flex-1 basis-0"
            />
            <AppButton
              label={isEditMode ? t("common.save") : t("common.add")}
              onPress={handleSubmit}
              className="min-w-0 flex-1 basis-0"
            />
          </ModalFooter>
        </ModalContent>
      </View>
    </Modal>
  );
}
