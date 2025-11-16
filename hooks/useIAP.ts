import { useContext } from "react";
import { IAPProvider, useIAP as useIAPFromProvider } from "./useIAPProvider";

// Re-export the provider for App.tsx
export { IAPProvider };

// Consumer hook for screens/components
export const useIAP = () => {
  return useIAPFromProvider();
};


