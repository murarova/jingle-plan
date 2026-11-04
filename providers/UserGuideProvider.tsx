import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { UserGuideModal } from "@/components/modals/user-guide";
import { hasSeenGuide, markGuideSeen } from "@/services/guide-storage";
import { useAppSelector } from "@/store/withTypes";

interface UserGuideContextType {
  openGuide: () => void;
}

const UserGuideContext = createContext<UserGuideContextType>({
  openGuide: () => {},
});

export function UserGuideProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const userUid = useAppSelector((state) => state.auth.userUid);

  useEffect(() => {
    if (!userUid) {
      setIsVisible(false);
      return;
    }

    let isCancelled = false;

    hasSeenGuide(userUid).then((seen) => {
      if (!isCancelled && !seen) {
        setIsVisible(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [userUid]);

  const openGuide = useCallback(() => setIsVisible(true), []);

  const closeGuide = useCallback(() => {
    setIsVisible(false);
    if (userUid) {
      markGuideSeen(userUid);
    }
  }, [userUid]);

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
