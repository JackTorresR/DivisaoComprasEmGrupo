import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "./firebaseConfig";

type EmailCredentialsProps = {
  email: string;
  password: string;
};

type AuthStateListenerProps = {
  onChange: (user: User | null) => void;
};

export const signUpWithEmail = async (
  props: EmailCredentialsProps,
): Promise<User> => {
  const { email, password } = props;
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  return credential.user;
};

export const signInWithEmail = async (
  props: EmailCredentialsProps,
): Promise<User> => {
  const { email, password } = props;
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  return credential.user;
};

export const signOutCurrentUser = (): Promise<void> => signOut(firebaseAuth);

export const subscribeToAuthState = (
  props: AuthStateListenerProps,
): Unsubscribe => {
  const { onChange } = props;
  return onAuthStateChanged(firebaseAuth, onChange);
};
