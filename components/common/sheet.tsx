import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { colors } from "@/constants/colors";

export type SheetRef = {
  show: () => void;
  hide: () => void;
};

type SheetProps = {
  children: React.ReactNode;
  snapPoints: string[];
  footerComponent?: (props: any) => React.ReactNode;
};

export const Sheet = forwardRef<SheetRef, SheetProps>(
  ({ children, snapPoints, footerComponent }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      show: () => sheetRef.current?.present(),
      hide: () => sheetRef.current?.forceClose(),
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        footerComponent={footerComponent}
        handleIndicatorStyle={{ backgroundColor: colors.ivoryLine }}
        style={{ backgroundColor: colors.ivoryCard, borderRadius: 13 }}
        enableDynamicSizing={false}
      >
        {children}
      </BottomSheetModal>
    );
  }
);
