import { Button } from "./Button";

type AppHeaderProps = {
  onLoadExample: () => void;
  onClearData: () => void;
};

export const AppHeader = ({ onLoadExample, onClearData }: AppHeaderProps) => (
  <header className="app-header">
    <div>
      <h1 className="app-header__title">Divisor de Compras</h1>
      <p className="app-header__description">
        Organize as compras da viagem e distribua os valores de forma
        equilibrada.
      </p>
    </div>
    <div className="app-header__actions">
      <Button onClick={onLoadExample}>Carregar exemplo</Button>
      <Button variant="ghost" onClick={onClearData}>
        Limpar dados
      </Button>
    </div>
  </header>
);
