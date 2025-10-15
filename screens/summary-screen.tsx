import { useCallback, useState, useRef } from "react";
import {
  Box,
  Text,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
  ChevronUpIcon,
  ChevronDownIcon,
  Textarea,
  TextareaInput,
  Button,
  Heading,
  ButtonText,
  ScrollView,
  SafeAreaView,
  HStack,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { EmptyScreen } from "../components/empty-screen";
import { TASK_CATEGORY, TASK_CONTEXT } from "../constants/constants";
import { ActionButtons } from "../components/common";
import { useRating } from "../hooks/useRating";
import { Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SummaryContextData, TaskContext, SummaryData } from "../types/types";
import { useAppSelector } from "../store/withTypes";
import {
  useRemoveTaskMutation,
  useSaveTaskByCategoryMutation,
  useGetUserDataQuery,
} from "../services/api";

interface EditableContentProps {
  context: TaskContext;
  text: string;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

interface ContentViewProps {
  text: string;
  context: TaskContext;
  onEdit: () => void;
  onDelete: () => void;
}

interface AccordionHeaderProps {
  context: TaskContext;
  isExpanded: boolean;
  getRating: (rate?: number) => { icon: string } | undefined;
  t: (key: string) => string;
  summary: SummaryContextData | null;
}

const EditableContent: React.FC<EditableContentProps> = ({
  text,
  onTextChange,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Textarea width="100%">
        <TextareaInput
          onChangeText={onTextChange}
          value={text}
          placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          onSubmitEditing={onSubmit}
        />
      </Textarea>
      <HStack space="sm" mt="$2">
        <Button
          flex={1}
          variant="outline"
          onPress={onCancel}
          borderRadius="$lg"
        >
          <ButtonText>{t("common.cancel")}</ButtonText>
        </Button>
        <Button flex={1} onPress={onSubmit} borderRadius="$lg">
          <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
        </Button>
      </HStack>
    </>
  );
};

const ContentView: React.FC<ContentViewProps> = ({
  text,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box mb="$2">
        <Text>{text || t("common.empty")}</Text>
      </Box>
      <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    </Box>
  );
};

const AccordionHeaderContent: React.FC<AccordionHeaderProps> = ({
  context,
  isExpanded,
  getRating,
  t,
  summary,
}) => (
  <>
    <AccordionTitleText>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box mr="$2">
          <Heading size="sm">{t(`context.${context}`)}</Heading>
        </Box>
        <Box display="flex" alignItems="center">
          <Text>{getRating(summary?.[context]?.rate)?.icon}</Text>
        </Box>
      </Box>
    </AccordionTitleText>
    <AccordionIcon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} ml="$3" />
  </>
);

export const SummaryScreen: React.FC = () => {
  const { t } = useTranslation();
  const getRating = useRating();
  const [saveTaskByCategory, { isLoading: isSaving }] =
    useSaveTaskByCategoryMutation();
  const [removeTask, { isLoading: isRemoving }] = useRemoveTaskMutation();

  const { currentUser } = useAppSelector((state) => state.auth);
  const { selectedYear } = useAppSelector((state) => state.app);
  const { data: userData } = useGetUserDataQuery(
    { uid: currentUser?.uid!, year: selectedYear },
    { skip: !currentUser?.uid || !selectedYear }
  );
  const summary = userData?.summary as SummaryContextData | null;

  const [editContext, setEditContext] = useState<TaskContext | null>(null);
  const [text, setText] = useState("");
  const scrollViewRef = useRef<any>(null);

  const isLoading = isSaving || isRemoving;

  const handleTaskSubmit = useCallback(
    async (context: TaskContext, item?: SummaryData) => {
      if (!text.trim()) {
        Alert.alert(t("common.error"), t("errors.emptyText"));
        return;
      }

      try {
        await saveTaskByCategory({
          category: TASK_CATEGORY.SUMMARY,
          data: {
            ...item,
            text,
            rate: item?.rate ?? 0,
          },
          context,
          year: selectedYear,
        }).unwrap();
        setEditContext(null);
        setText("");
      } catch (error) {
        Alert.alert(t("common.error"), t("errors.generic"));
      }
    },
    [saveTaskByCategory, text, t, selectedYear]
  );

  const handleTaskRemove = useCallback(
    async (context: TaskContext) => {
      Alert.alert(t("common.delete"), t("messages.confirmDeleteTask"), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await removeTask({
                category: TASK_CATEGORY.SUMMARY,
                context,
                year: selectedYear,
              }).unwrap();
              setText("");
            } catch (error) {
              Alert.alert(t("common.error"), t("errors.generic"));
            }
          },
        },
      ]);
    },
    [removeTask, t, selectedYear]
  );

  const handleCancel = useCallback(
    (context: TaskContext) => {
      // Reset form to original state
      if (summary?.[context]?.text) {
        setText(summary[context].text);
      } else {
        setText("");
      }
      setEditContext(null);
    },
    [summary]
  );

  if (!userData) {
    return null;
  }

  if (!summary) {
    return <EmptyScreen />;
  }

  return (
    <SafeAreaView flex={1}>
      <Box p="$2" flex={1}>
        <KeyboardAwareScrollView ref={scrollViewRef} extraScrollHeight={100}>
          <ScrollView>
            <Accordion
              key="summary"
              size="md"
              my="$2"
              type="multiple"
              borderRadius="$lg"
            >
              {Object.values(TASK_CONTEXT).map((context) => {
                if (!summary[context]) return null;

                return (
                  <AccordionItem
                    key={context}
                    value={context}
                    borderRadius="$lg"
                    mb="$5"
                  >
                    <AccordionHeader>
                      <AccordionTrigger>
                        {({ isExpanded }) => {
                          return (
                            <AccordionHeaderContent
                              context={context}
                              isExpanded={isExpanded}
                              getRating={getRating}
                              t={t}
                              summary={summary}
                            />
                          );
                        }}
                      </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent>
                      <Box>
                        {editContext === context ? (
                          <EditableContent
                            context={context}
                            text={text || summary[context]?.text || ""}
                            onTextChange={setText}
                            onSubmit={() =>
                              handleTaskSubmit(context, summary[context])
                            }
                            onCancel={() => handleCancel(context)}
                          />
                        ) : (
                          <ContentView
                            text={summary[context]?.text || ""}
                            context={context}
                            onEdit={() => {
                              setEditContext(context);
                              setText(summary[context]?.text || "");
                            }}
                            onDelete={() => handleTaskRemove(context)}
                          />
                        )}
                      </Box>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollView>
        </KeyboardAwareScrollView>
      </Box>
    </SafeAreaView>
  );
};
