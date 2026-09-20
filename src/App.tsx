import { LoadingState } from "./components/common/LoadingState";
import { HomeScreen } from "./components/trip/HomeScreen";
import { TripPage } from "./components/trip/TripPage";
import { useAuth } from "./hooks/useAuth";
import { useSlugRoute } from "./routing/useSlugRoute";

export const App = () => {
  const { slug, navigateToTrip, navigateHome } = useSlugRoute();
  const { user, initializing, pending, authError, signUp, signIn, signOut } =
    useAuth();

  if (initializing) {
    return (
      <div className="app">
        <LoadingState />
      </div>
    );
  }

  if (slug === null) {
    return (
      <HomeScreen
        user={user}
        pending={pending}
        onSignIn={signIn}
        onSignUp={signUp}
        onSignOut={signOut}
        authError={authError}
        onOpenTrip={navigateToTrip}
      />
    );
  }

  return (
    <TripPage
      slug={slug}
      user={user}
      onSignOut={signOut}
      onGoHome={navigateHome}
    />
  );
};
