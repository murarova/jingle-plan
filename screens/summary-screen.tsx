import { useRef } from "react";
import {
  Box,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  ScrollView,
  SafeAreaView,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { EmptyScreen } from "../components/empty-screen";
import { TASK_CONTEXT } from "../constants/constants";
import { useRating } from "../hooks/useRating";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SummaryContextData } from "../types/types";
import { useAppSelector } from "../store/withTypes";
import { useGetUserDataQuery } from "../services/api";
import { useSummaryScreen } from "./summary-screen/hooks/useSummaryScreen";
import { EditableContent } from "./summary-screen/summary-editable-content";
import { ContentView } from "./summary-screen/summary-content-view";
import { AccordionHeaderContent } from "./summary-screen/summary-accordion-header";

export const SummaryScreen: React.FC = () => {
  const { t } = useTranslation();
  const getRating = useRating();

  const { currentUser } = useAppSelector((state) => state.auth);
  const { selectedYear } = useAppSelector((state) => state.app);
  const { data: userData } = useGetUserDataQuery(
    { uid: currentUser?.uid!, year: selectedYear },
    { skip: !currentUser?.uid || !selectedYear }
  );
  const summary = userData?.summary as SummaryContextData | null;

  const scrollViewRef = useRef<any>(null);

  const {
    editContext,
    text,
    setText,
    handleTaskSubmit,
    handleTaskRemove,
    handleCancel,
    handleEdit,
  } = useSummaryScreen({ summary });

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
                            onEdit={() => handleEdit(context)}
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
