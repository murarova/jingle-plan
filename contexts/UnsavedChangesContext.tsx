import { createContext, useContext, useState, ReactNode } from "react";

interface UnsavedChangesContextType {
  isUnsavedChanges: boolean;
  setUnsavedChanges: (value: boolean) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [isUnsavedChanges, setUnsavedChanges] = useState(false);

  return (
    <UnsavedChangesContext.Provider
      value={{
        isUnsavedChanges,
        setUnsavedChanges,
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);
  if (context === undefined) {
    throw new Error("useUnsavedChanges must be used within an UnsavedChangesProvider");
  }
  return context;
}

