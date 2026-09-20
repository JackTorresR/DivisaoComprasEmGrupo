import { useCallback, useEffect, useState } from "react";

const readSlugFromPath = (): string | null => {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return path === "" ? null : path;
};

export const useSlugRoute = () => {
  const [slug, setSlug] = useState<string | null>(readSlugFromPath);

  useEffect(() => {
    const handlePopState = () => setSlug(readSlugFromPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToTrip = useCallback((props: { slug: string }) => {
    window.history.pushState({}, "", `/${props.slug}`);
    setSlug(props.slug);
  }, []);

  const navigateHome = useCallback(() => {
    window.history.pushState({}, "", "/");
    setSlug(null);
  }, []);

  return { slug, navigateToTrip, navigateHome };
};
