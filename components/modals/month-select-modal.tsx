import { typeRole } from "@/constants/typography";
import { allMonths } from "@/constants";
import { Box } from "@/ui/box";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
} from "@/ui/select";
import { SelectContext } from "@gluestack-ui/core/lib/esm/select/creator/SelectContext";
import {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useTranslation } from "react-i18next";
import type { SheetRef } from "../common";

function SelectOpener({ openToken }: { openToken: number }) {
  const { setIsOpen } = useContext(SelectContext);
  const openedToken = useRef(0);

  useEffect(() => {
    if (!openToken || openToken === openedToken.current) {
      return;
    }
    openedToken.current = openToken;
    setIsOpen(true);
  }, [openToken, setIsOpen]);

  return null;
}

export function MonthSelectModal({
  onMonthSelect,
  closeMonthModal,
  sheetRef,
  month,
}: {
  onMonthSelect: (month: string) => void;
  closeMonthModal: () => void;
  sheetRef: RefObject<SheetRef | null>;
  month?: string;
}) {
  const { t } = useTranslation();
  const [openToken, setOpenToken] = useState(0);

  useImperativeHandle(sheetRef, () => ({
    show: () => setOpenToken((token) => token + 1),
    hide: () => setOpenToken(0),
  }));

  return (
    <Box className="absolute h-0 w-0">
      <Select
        selectedValue={month ?? ""}
        onValueChange={onMonthSelect}
        onClose={closeMonthModal}
      >
        <SelectOpener openToken={openToken} />
        <SelectTrigger className="h-11 w-0 rounded-2xl border-ivory-line bg-ivory-card opacity-0">
          <SelectInput
            className={`${typeRole.body} text-primaryText placeholder:text-secondaryText`}
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
              {allMonths.map((item) => (
                <SelectItem
                  key={item}
                  label={t(`months.${item}`)}
                  value={item}
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
    </Box>
  );
}
