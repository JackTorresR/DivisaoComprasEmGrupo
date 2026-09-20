import { FirebaseError } from "firebase/app";

const ERROR_MESSAGES: Record<string, string> = {
  "not-found": "Essa lista não foi encontrada.",
  "auth/invalid-email": "Digite um e-mail válido.",
  "auth/wrong-password": "E-mail ou senha incorretos.",
  "auth/user-not-found": "E-mail ou senha incorretos.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "permission-denied": "Você não tem permissão para fazer essa alteração.",
  "auth/too-many-requests":
    "Muitas tentativas seguidas. Aguarde um pouco e tente novamente.",
  "auth/network-request-failed":
    "Falha de conexão. Verifique sua internet e tente novamente.",
  "auth/email-already-in-use":
    "Este e-mail já está cadastrado. Tente entrar em vez de criar uma conta.",
};

const DEFAULT_ERROR_MESSAGE = "Algo deu errado. Tente novamente em instantes.";

export const describeFirebaseError = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return ERROR_MESSAGES[error.code] ?? DEFAULT_ERROR_MESSAGE;
  }

  const falhaAmbiente =
    error instanceof Error && error.message.includes("Variável de ambiente");

  if (falhaAmbiente) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
};
