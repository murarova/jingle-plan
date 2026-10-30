import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface PlansSearchContextValue {
  query: string;
  setQuery: (value: string) => void;
  searchOpen: boolean;
  toggleSearch: () => void;
}

const PlansSearchContext = createContext<PlansSearchContextValue | null>(null);

export function PlansSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSearch = useCallback(() => {
    setSearchOpen((open) => !open);
    setQuery("");
  }, []);

  const value = useMemo(
    () => ({ query, setQuery, searchOpen, toggleSearch }),
    [query, searchOpen, toggleSearch],
  );

  return (
    <PlansSearchContext.Provider value={value}>
      {children}
    </PlansSearchContext.Provider>
  );
}

export function usePlansSearch() {
  const value = useContext(PlansSearchContext);
  if (!value) {
    throw new Error("usePlansSearch must be used within PlansSearchProvider");
  }
  return value;
}
