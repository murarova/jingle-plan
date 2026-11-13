import type { PaywallPlacement } from "@/types/analytics";

export type RootStackParamList = {
  INTRO: undefined;
  Register: undefined;
  Login: undefined;
  Loading: undefined;
  Home: { screen?: string } | undefined;
  Paywall: { placement?: PaywallPlacement } | undefined;
};
