import { Button } from "../common/Button";

type TripStatusScreenProps = {
  title: string;
  description: string;
  onGoHome: () => void;
};

export const TripStatusScreen = (props: TripStatusScreenProps) => {
  const { title, description, onGoHome } = props;
  return (
    <div className="card trip-status">
      <h2 className="card__title">{title}</h2>
      <p className="card__description">{description}</p>
      <Button onClick={onGoHome}>Voltar para o início</Button>
    </div>
  );
};
