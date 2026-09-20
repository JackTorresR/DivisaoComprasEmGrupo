import type { User } from "firebase/auth";
import { useState } from "react";
import { validateReadyToCalculate } from "../../domain/validation/readiness";
import { useDistributionCalculator } from "../../hooks/useDistributionCalculator";
import { useTrip } from "../../hooks/useTrip";
import { useTripData } from "../../hooks/useTripData";
import { useAppStore } from "../../store/useAppStore";
import { scrollToElement } from "../../utils/scrollToElement";
import { UserMenu } from "../auth/UserMenu";
import { Button } from "../common/Button";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { ThemeToggle } from "../common/ThemeToggle";
import { CalculatingOverlay } from "../distribution/CalculatingOverlay";
import { DistributionSection } from "../distribution/DistributionSection";
import { PeopleSection } from "../people/PeopleSection";
import { ProductsSection } from "../products/ProductsSection";
import { ShoppingListSection } from "../shopping-list/ShoppingListSection";
import { SummaryPanel } from "../summary/SummaryPanel";
import { ReadOnlyNotice } from "./ReadOnlyNotice";
import { ShareLinkBar } from "./ShareLinkBar";
import { TripStatusScreen } from "./TripStatusScreen";

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

type TripPageProps = {
  slug: string;
  user: User | null;
  onGoHome: () => void;
  onSignOut: () => void;
};

export const TripPage = (props: TripPageProps) => {
  const { slug, user, onSignOut, onGoHome } = props;
  const { status, isOwner, saveError } = useTrip({
    slug,
    userId: user?.uid ?? null,
  });

  const { people, products } = useTripData();
  const clearAll = useAppStore((state) => state.clearAll);
  const loadExample = useAppStore((state) => state.loadExample);

  const { isCalculating, progress, error, calculate, cancel } =
    useDistributionCalculator(focusDistribution);

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  if (status === "loading") {
    return <p className="trip-loading">Carregando lista…</p>;
  }

  if (status === "not-found") {
    return (
      <div className="app">
        <TripStatusScreen
          onGoHome={onGoHome}
          title="Lista não encontrada"
          description="Verifique se o link foi digitado corretamente."
        />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="app">
        <TripStatusScreen
          onGoHome={onGoHome}
          title="Não foi possível carregar a lista"
          description={saveError ?? "Tente novamente em instantes."}
        />
      </div>
    );
  }

  const hasData = people.length > 0 || products.length > 0;
  const canCalculate =
    validateReadyToCalculate(people.length, products.length) === null;

  const shareUrl = `${window.location.origin}/${slug}`;

  const requestLoadExample = () =>
    hasData ? setPendingAction("example") : loadExample();

  const confirmPendingAction = () => {
    if (pendingAction === "clear") clearAll();
    if (pendingAction === "example") loadExample();
    setPendingAction(null);
  };

  const dialogTexts = DIALOG_TEXTS[pendingAction ?? "clear"];
  const rotuloNavegacaoPrincipal = user
    ? "Voltar para tela inicial"
    : "Acessar o sistema";

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Divisor de Compras</h1>
          <p className="app-header__description">/{slug}</p>
        </div>
        <div className="app-header__actions">
          {isOwner && (
            <>
              <Button onClick={requestLoadExample}>Carregar exemplo</Button>
              <Button variant="ghost" onClick={() => setPendingAction("clear")}>
                Limpar dados
              </Button>
            </>
          )}
          {user && <UserMenu email={user.email} onSignOut={onSignOut} />}
          <Button variant="ghost" onClick={onGoHome}>
            {rotuloNavegacaoPrincipal}
          </Button>
          <ThemeToggle />
        </div>
      </header>
      {isOwner ? <ShareLinkBar shareUrl={shareUrl} /> : <ReadOnlyNotice />}
      {saveError && (
        <p className="field__message field__message--error" role="alert">
          {saveError}
        </p>
      )}
      <div className="dashboard">
        <aside className="dashboard__aside">
          <SummaryPanel
            isCalculating={isCalculating}
            error={error}
            onCalculate={calculate}
            readOnly={!isOwner}
          />
        </aside>
        <main className="dashboard__main">
          {isOwner && <PeopleSection />}
          {isOwner && <ProductsSection />}
          <ShoppingListSection />
          <DistributionSection
            isCalculating={isCalculating}
            canCalculate={canCalculate}
            onCalculate={calculate}
            readOnly={!isOwner}
          />
        </main>
      </div>
      {isCalculating && (
        <CalculatingOverlay progress={progress} onCancel={cancel} />
      )}
      <ConfirmDialog
        title={dialogTexts.title}
        open={pendingAction !== null}
        message={dialogTexts.message}
        onConfirm={confirmPendingAction}
        confirmLabel={dialogTexts.confirmLabel}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
};
