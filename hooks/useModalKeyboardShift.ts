import { useEffect, useRef, useState, type RefObject } from "react";
import { Keyboard, Platform, View } from "react-native";

const MIN_TOP = 96;

export function useModalKeyboardShift(ref: RefObject<View | null>) {
  const [translateY, setTranslateY] = useState(0);
  const translateRef = useRef(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const apply = (next: number) => {
      translateRef.current = next;
      setTranslateY(next);
    };

    const show = Keyboard.addListener(showEvent, (event) => {
      const node = ref.current;
      if (!node) {
        return;
      }

      const keyboardTop = event.endCoordinates.screenY;
      node.measureInWindow((_x, y, _w, height) => {
        const baseY = y - translateRef.current;
        if (baseY < MIN_TOP) {
          apply(MIN_TOP - baseY);
          return;
        }

        const overlap = baseY + height + 12 - keyboardTop;
        const maxLift = baseY - MIN_TOP;
        const lift = overlap > 0 ? Math.min(overlap, maxLift) : 0;
        apply(-lift);
      });
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      apply(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [ref]);

  return translateY;
}
