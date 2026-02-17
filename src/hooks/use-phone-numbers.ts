import { useState, useEffect } from "react";
import { listPhoneNumbers } from "../twilio/phone-numbers";
import type { TwilioPhoneNumber } from "../types";

export function usePhoneNumbers() {
  const [numbers, setNumbers] = useState<TwilioPhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      const result = await listPhoneNumbers();
      if (cancelled) return;

      if (result.ok) {
        setNumbers(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { numbers, loading, error };
}
