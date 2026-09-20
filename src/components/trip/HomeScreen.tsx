import type { User } from "firebase/auth";
import { AuthPanel } from "../auth/AuthPanel";
import { UserMenu } from "../auth/UserMenu";
import { ThemeToggle } from "../common/ThemeToggle";
import { CreateTripForm } from "./CreateTripForm";
import { OwnedTripsList } from "./OwnedTripsList";

type EmailCredentialsProps = {
  email: string;
  password: string;
};

type HomeScreenProps = {
  pending: boolean;
  user: User | null;
  onSignOut: () => void;
  authError: string | null;
  onOpenTrip: (props: { slug: string }) => void;
  onSignIn: (props: EmailCredentialsProps) => Promise<boolean>;
  onSignUp: (props: EmailCredentialsProps) => Promise<boolean>;
};

export const HomeScreen = (props: HomeScreenProps) => {
  const {
    user,
    pending,
    onSignIn,
    onSignUp,
    onSignOut,
    authError,
    onOpenTrip,
  } = props;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Divisor de Compras</h1>
          <p className="app-header__description">
            Organize as compras de uma viagem em grupo e distribua os valores de
            forma equilibrada.
          </p>
        </div>
        <div className="app-header__actions">
          {user && <UserMenu email={user.email} onSignOut={onSignOut} />}
          <ThemeToggle />
        </div>
      </header>
      {user ? (
        <div className="home-dashboard">
          <CreateTripForm ownerId={user.uid} onCreated={onOpenTrip} />
          <OwnedTripsList ownerId={user.uid} onOpenTrip={onOpenTrip} />
        </div>
      ) : (
        <AuthPanel
          pending={pending}
          onSignIn={onSignIn}
          onSignUp={onSignUp}
          authError={authError}
        />
      )}
    </div>
  );
};
