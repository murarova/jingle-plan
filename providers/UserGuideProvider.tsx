import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { UserGuideModal } from "@/components/modals/user-guide";
import { hasSeenGuide, markGuideSeen } from "@/services/guide-storage";
import { useAppSelector } from "@/store/withTypes";
import {
  trackOnboardingComplete,
  trackSkipOnboarding,
} from "@/services/analytics";
import type { GuideOutcome } from "@/types/analytics";

interface UserGuideContextType {
  openGuide: () => void;
}

const UserGuideContext = createContext<UserGuideContextType>({
  openGuide: () => {},
});

export function UserGuideProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const userUid = useAppSelector((state) => state.auth.userUid);
  const isFirstViewRef = useRef(false);

  useEffect(() => {
    if (!userUid) {
      setIsVisible(false);
      isFirstViewRef.current = false;
      return;
    }

    let isCancelled = false;

    hasSeenGuide(userUid).then((seen) => {
      if (!isCancelled && !seen) {
        isFirstViewRef.current = true;
        setIsVisible(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [userUid]);

  const openGuide = useCallback(() => setIsVisible(true), []);

  const closeGuide = useCallback(
    (outcome: GuideOutcome, step?: number) => {
      setIsVisible(false);
      if (userUid) {
        markGuideSeen(userUid);
      }
      if (isFirstViewRef.current) {
        isFirstViewRef.current = false;
        if (outcome === "completed") {
          trackOnboardingComplete();
        } else {
          trackSkipOnboarding(step);
        }
      }
    },
    [userUid],
  );

  const value = useMemo(() => ({ openGuide }), [openGuide]);

  return (
    <UserGuideContext.Provider value={value}>
      {children}
      <UserGuideModal isOpen={isVisible} onClose={closeGuide} />
    </UserGuideContext.Provider>
  );
}

export function useUserGuide() {
  return useContext(UserGuideContext);
}
