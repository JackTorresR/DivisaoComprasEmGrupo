import { useEffect, useState } from "react";
import type { PersonShare } from "../domain/calculations/summary";
import type { Cents } from "../domain/money/money";
import { renderPersonCardImage } from "../services/image/personCardImage";

type GeneratedImage = {
  blob: Blob;
  url: string;
};

export const usePersonCardImage = (share: PersonShare, averageCents: Cents) => {
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isCancelled = false;

    renderPersonCardImage(share, averageCents)
      .then((blob) => {
        if (isCancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setImage({ blob, url: objectUrl });
      })
      .catch(() => {
        if (!isCancelled) setHasFailed(true);
      });

    return () => {
      isCancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [share, averageCents]);

  return { image, hasFailed };
};
