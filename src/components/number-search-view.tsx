import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { NumberSearchForm } from "./number-search-form";
import { SearchResultList } from "./search-result-list";
import { PurchasePanel } from "./purchase-panel";
import { useSearchNumbers } from "../hooks/use-search-numbers";
import type { FocusZone } from "../types";

interface NumberSearchViewProps {
  zone: FocusZone;
  purchasing: boolean;
  purchaseError: string | null;
  onPurchase: (phoneNumber: string) => void;
}

export function NumberSearchView({
  zone,
  purchasing,
  purchaseError,
  onPurchase,
}: NumberSearchViewProps) {
  const [countryCode, setCountryCode] = useState("US");
  const [areaCode, setAreaCode] = useState("");
  const [contains, setContains] = useState("");
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  const { results, searching, error: searchError, hasSearched, search } =
    useSearchNumbers();

  const isFormZone =
    zone === "search-country" ||
    zone === "search-area-code" ||
    zone === "search-contains";

  useKeyboard((key) => {
    if (key.name === "return" && key.ctrl && isFormZone) {
      search(countryCode, areaCode, contains);
      setSelectedResultIndex(0);
    }
  });

  const selectedNumber = results[selectedResultIndex] ?? null;

  return (
    <box style={{ flexDirection: "row", flexGrow: 1 }}>
      {/* Left pane: form + results */}
      <box style={{ flexDirection: "column", flexGrow: 1 }}>
        <NumberSearchForm
          countryCode={countryCode}
          areaCode={areaCode}
          contains={contains}
          onCountryCodeChange={setCountryCode}
          onAreaCodeChange={setAreaCode}
          onContainsChange={setContains}
          zone={zone}
          searching={searching}
          searchError={searchError}
        />
        <SearchResultList
          results={results}
          searching={searching}
          searchError={searchError}
          hasSearched={hasSearched}
          focused={zone === "search-results"}
          selectedIndex={selectedResultIndex}
          onSelectedIndexChange={setSelectedResultIndex}
        />
      </box>

      {/* Right pane: purchase */}
      <PurchasePanel
        number={selectedNumber}
        zone={zone}
        purchasing={purchasing}
        purchaseError={purchaseError}
        onPurchase={onPurchase}
      />
    </box>
  );
}
