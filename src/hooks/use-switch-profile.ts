import { useState, useCallback } from "react";
import { switchProfile } from "../twilio/accounts";

interface UseSwitchProfileOptions {
  onSuccess?: () => void;
}

export function useSwitchProfile({ onSuccess }: UseSwitchProfileOptions = {}) {
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSwitch = useCallback(
    async (profileId: string) => {
      if (!profileId) {
        setError("Profile ID is required");
        return;
      }

      setSwitching(true);
      setError(null);

      const result = await switchProfile(profileId);

      setSwitching(false);

      if (result.ok) {
        onSuccess?.();
      } else {
        setError(result.error);
      }
    },
    [onSuccess]
  );

  return { switchProfile: doSwitch, switching, error };
}
