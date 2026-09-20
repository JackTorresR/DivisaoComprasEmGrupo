import { useCallback, useEffect, useState } from "react";

export type Tema = "dark" | "light";

const CHAVE_ARMAZENAMENTO_TEMA = "divisor-de-compras:tema";
const TEMA_PADRAO: Tema = "dark";

const lerTemaArmazenado = (): Tema =>
  localStorage.getItem(CHAVE_ARMAZENAMENTO_TEMA) === "light"
    ? "light"
    : TEMA_PADRAO;

const aplicarTemaNoDocumento = (tema: Tema) =>
  document.documentElement.setAttribute("data-theme", tema);

export const useTheme = () => {
  const [tema, setTema] = useState<Tema>(lerTemaArmazenado);

  useEffect(() => {
    aplicarTemaNoDocumento(tema);
    localStorage.setItem(CHAVE_ARMAZENAMENTO_TEMA, tema);
  }, [tema]);

  const alternarTema = useCallback(() => {
    setTema((temaAtual) => (temaAtual === "dark" ? "light" : "dark"));
  }, []);

  return { tema, alternarTema };
};
