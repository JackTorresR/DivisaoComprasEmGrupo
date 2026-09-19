import { useState } from "react";
import { AppHeader } from "./components/common/AppHeader";
import { ConfirmDialog } from "./components/common/ConfirmDialog";
import { CalculatingOverlay } from "./components/distribution/CalculatingOverlay";
import { DistributionSection } from "./components/distribution/DistributionSection";
import { PeopleSection } from "./components/people/PeopleSection";
import { ProductsSection } from "./components/products/ProductsSection";
import { ShoppingListSection } from "./components/shopping-list/ShoppingListSection";
import { SummaryPanel } from "./components/summary/SummaryPanel";
import { validateReadyToCalculate } from "./domain/validation/readiness";
import { useDistributionCalculator } from "./hooks/useDistributionCalculator";
import { useTripData } from "./hooks/useTripData";
import { useAppStore } from "./store/useAppStore";
import { scrollToElement } from "./utils/scrollToElement";

type PendingAction = "clear" | "example" | null;

const DIALOG_TEXTS = {
  clear: {
    confirmLabel: "Limpar dados",
    title: "Limpar todos os dados?",
    message:
      "Pessoas, produtos, vínculos e a distribuição calculada serão apagados. Essa ação não pode ser desfeita.",
  },
  example: {
    confirmLabel: "Carregar exemplo",
    title: "Substituir pelos dados de exemplo?",
    message: "Os dados atuais serão substituídos por um cenário de exemplo.",
  },
};

const focusDistribution = () => scrollToElement("distribution");

export const App = () => {
  const { people, products } = useTripData();
  const loadExample = useAppStore((state) => state.loadExample);
  const clearAll = useAppStore((state) => state.clearAll);
  const { isCalculating, progress, error, calculate, cancel } =
    useDistributionCalculator(focusDistribution);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const hasData = people.length > 0 || products.length > 0;
  const canCalculate =
    validateReadyToCalculate(people.length, products.length) === null;

  const requestLoadExample = () =>
    hasData ? setPendingAction("example") : loadExample();

  const confirmPendingAction = () => {
    if (pendingAction === "clear") clearAll();
    if (pendingAction === "example") loadExample();
    setPendingAction(null);
  };

  const dialogTexts = DIALOG_TEXTS[pendingAction ?? "clear"];

  return (
    <div className="app">
      <AppHeader
        onLoadExample={requestLoadExample}
        onClearData={() => setPendingAction("clear")}
      />
      <div className="dashboard">
        <aside className="dashboard__aside">
          <SummaryPanel
            isCalculating={isCalculating}
            error={error}
            onCalculate={calculate}
          />
        </aside>
        <main className="dashboard__main">
          <PeopleSection />
          <ProductsSection />
          <ShoppingListSection />
          <DistributionSection
            isCalculating={isCalculating}
            canCalculate={canCalculate}
            onCalculate={calculate}
          />
        </main>
      </div>
      {isCalculating && (
        <CalculatingOverlay progress={progress} onCancel={cancel} />
      )}
      <ConfirmDialog
        open={pendingAction !== null}
        title={dialogTexts.title}
        message={dialogTexts.message}
        confirmLabel={dialogTexts.confirmLabel}
        onConfirm={confirmPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
};
