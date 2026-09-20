import { useCallback, useEffect, useState } from "react";

const BASE_PATH = import.meta.env.BASE_URL;

const readSlugFromPath = (): string | null => {
  let path = window.location.pathname;
  if (path.startsWith(BASE_PATH)) {
    path = path.slice(BASE_PATH.length);
  }
  path = path.replace(/^\/+|\/+$/g, "");
  return path === "" ? null : path;
};

const buildTripPath = (slug: string): string => {
  const baseComBarra = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;
  return `${baseComBarra}${slug}`;
};

type NavigateToTripProps = {
  slug: string;
  replace?: boolean;
};

export const useSlugRoute = () => {
  const [slug, setSlug] = useState<string | null>(readSlugFromPath);

  useEffect(() => {
    const handlePopState = () => setSlug(readSlugFromPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToTrip = useCallback((props: NavigateToTripProps) => {
    const { slug: novoSlug, replace = false } = props;
    const novoPath = buildTripPath(novoSlug);
    if (replace) {
      window.history.replaceState({}, "", novoPath);
    } else {
      window.history.pushState({}, "", novoPath);
    }
    setSlug(novoSlug);
  }, []);

  const navigateHome = useCallback(() => {
    window.history.pushState({}, "", BASE_PATH);
    setSlug(null);
  }, []);

  return { slug, navigateToTrip, navigateHome };
};
