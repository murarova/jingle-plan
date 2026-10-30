import { useEffect, useState } from "react";

export function useSearchExpanded(
  defaultValues: string[],
  searchExpandedKey: string,
) {
  const [expanded, setExpanded] = useState(defaultValues);

  useEffect(() => {
    if (!searchExpandedKey) return;
    const ids = searchExpandedKey.split("\n")[1] ?? "";
    setExpanded(ids.split("\0").filter(Boolean));
  }, [searchExpandedKey]);

  return [expanded, setExpanded] as const;
}
