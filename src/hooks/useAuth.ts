import type { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import {
  signInWithEmail,
  signOutCurrentUser,
  signUpWithEmail,
  subscribeToAuthState,
} from "../services/firebase/firebaseAuth";
import { describeFirebaseError } from "../services/firebase/firebaseErrors";

type EmailCredentialsProps = {
  email: string;
  password: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [pending, setPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(
    () =>
      subscribeToAuthState({
        onChange: (nextUser) => {
          setUser(nextUser);
          setInitializing(false);
        },
      }),
    [],
  );

  const runAuthAction = useCallback(async (action: () => Promise<User>) => {
    setPending(true);
    setAuthError(null);
    try {
      await action();
      return true;
    } catch (error) {
      setAuthError(describeFirebaseError(error));
      return false;
    } finally {
      setPending(false);
    }
  }, []);

  const signUp = useCallback(
    (props: EmailCredentialsProps) =>
      runAuthAction(() => signUpWithEmail(props)),
    [runAuthAction],
  );

  const signIn = useCallback(
    (props: EmailCredentialsProps) =>
      runAuthAction(() => signInWithEmail(props)),
    [runAuthAction],
  );

  const signOut = useCallback(() => signOutCurrentUser(), []);

  return { user, initializing, pending, authError, signUp, signIn, signOut };
};
