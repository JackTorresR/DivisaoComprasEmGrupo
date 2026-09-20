import { useState, type FormEvent } from "react";
import {
  normalizeSlug,
  validateSlugFormat,
} from "../../domain/validation/slug";
import { describeFirebaseError } from "../../services/firebase/firebaseErrors";
import {
  createTrip,
  isSlugAvailable,
} from "../../services/firebase/tripRepository";
import { Button } from "../common/Button";
import { LoadingOverlay } from "../common/LoadingOverlay";
import { TextField } from "../common/TextField";

type CreateTripFormProps = {
  ownerId: string;
  onCreated: (props: { slug: string }) => void;
};

export const CreateTripForm = (props: CreateTripFormProps) => {
  const { ownerId, onCreated } = props;
  const [rawName, setRawName] = useState("");
  const previewSlug = normalizeSlug(rawName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formatError = validateSlugFormat(previewSlug);
    if (formatError) {
      setError(formatError);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const available = await isSlugAvailable({ slug: previewSlug });
      if (!available) {
        setError("Esse link já está em uso. Escolha outro nome!");
        return;
      }
      await createTrip({ slug: previewSlug, ownerId });
      onCreated({ slug: previewSlug });
    } catch (creationError) {
      setError(describeFirebaseError(creationError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card create-trip" aria-labelledby="create-trip-title">
      <h2 id="create-trip-title" className="card__title">
        Criar nova lista
      </h2>
      <p className="card__description">
        Escolha um nome para o link que você vai compartilhar com o grupo.
      </p>
      <form className="create-trip__form" onSubmit={handleSubmit}>
        <TextField
          error={error}
          value={rawName}
          label="Nome da lista"
          placeholder="Ex.: Mulungu 2026-09"
          onChange={(event) => setRawName(event.target.value)}
          hint={
            previewSlug
              ? `Link: ${window.location.origin}/${previewSlug}`
              : undefined
          }
        />
        <Button
          type="submit"
          variant="primary"
          disabled={submitting || previewSlug === ""}
        >
          Criar lista
        </Button>
      </form>
      {submitting && <LoadingOverlay />}
    </section>
  );
};
