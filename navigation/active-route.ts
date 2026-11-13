import type { NavigationState, PartialState } from "@react-navigation/native";

type State = NavigationState | PartialState<NavigationState>;

export function getActiveRouteName(state: State | undefined): string | null {
  if (!state || !state.routes?.length) return null;
  const route = state.routes[state.index ?? state.routes.length - 1];
  if (!route) return null;
  const nested = getActiveRouteName(route.state as State | undefined);
  return nested ?? route.name;
}
