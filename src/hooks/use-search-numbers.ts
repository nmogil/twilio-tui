import { useState, useCallback } from "react";
import { searchAvailableNumbers } from "../twilio/phone-numbers";
import type { AvailablePhoneNumber } from "../types";

export function useSearchNumbers() {
  const [results, setResults] = useState<AvailablePhoneNumber[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(
    async (countryCode: string, areaCode?: string, contains?: string) => {
      if (!countryCode) {
        setError("Country code is required");
        return;
      }
      setSearching(true);
      setError(null);
      const result = await searchAvailableNumbers(
        countryCode,
        areaCode || undefined,
        contains || undefined
      );
      setSearching(false);
      setHasSearched(true);
      if (result.ok) {
        setResults(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    },
    []
  );

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    setHasSearched(false);
  }, []);

  return { results, searching, error, hasSearched, search, clear };
}
