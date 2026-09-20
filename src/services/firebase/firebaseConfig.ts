import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseEnvConfig = {
  appId: string;
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
};

const readEnvValue = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${key} não foi definida. Copie ".env.example" para ".env" e preencha com os dados do seu projeto Firebase.`,
    );
  }
  return value;
};

const readFirebaseEnvConfig = (): FirebaseEnvConfig => ({
  appId: readEnvValue("VITE_FIREBASE_APP_ID"),
  apiKey: readEnvValue("VITE_FIREBASE_API_KEY"),
  authDomain: readEnvValue("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: readEnvValue("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: readEnvValue("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readEnvValue("VITE_FIREBASE_MESSAGING_SENDER_ID"),
});

const createFirebaseApp = (): FirebaseApp => {
  const existingApps = getApps();
  if (existingApps.length > 0) return existingApps[0];
  return initializeApp(readFirebaseEnvConfig());
};

const firebaseApp = createFirebaseApp();

export const firebaseAuth: Auth = getAuth(firebaseApp);
export const firestore: Firestore = getFirestore(firebaseApp);
