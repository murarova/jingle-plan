import { ScrollView } from "@/ui/scroll-view";

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/ui/accordion";

import { Box } from "@/ui/box";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { EmptyScreen } from "../../components/common/empty-screen";
import { TASK_CONTEXT } from "../../constants/constants";
import { useRating } from "../../hooks/useRating";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SummaryContextData } from "../../types/types";
import { useAppSelector } from "../../store/withTypes";
import { useGetUserDataQuery } from "../../services/api";
import { useSummaryScreen } from "./hooks/useSummaryScreen";
import { EditableContent } from "./summary-editable-content";
import { ContentView } from "./summary-content-view";
import { AccordionHeaderContent } from "./summary-accordion-header";

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

  if (!summary) {
    return <EmptyScreen />;
  }

  return (
    <Box className="flex-1">
      <Box className="p-2 flex-1">
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          extraScrollHeight={100}
          enableResetScrollToCoords={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
        >
          <ScrollView>
            <Accordion key="summary" type="multiple" className="my-2 rounded-lg">
              {Object.values(TASK_CONTEXT).map((context) => {
                if (!summary[context]) return null;

                return (
                  <AccordionItem key={context} value={context} className="rounded-lg mb-5">
                    <AccordionHeader>
                      <AccordionTrigger>
                        {({ isExpanded }: { isExpanded: boolean }) => {
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
    </Box>
  );
};
