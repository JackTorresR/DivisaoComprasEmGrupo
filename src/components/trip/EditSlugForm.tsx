import { useState, type FormEvent } from "react";
import {
  normalizeSlug,
  validateSlugFormat,
} from "../../domain/validation/slug";
import { describeFirebaseError } from "../../services/firebase/firebaseErrors";
import {
  isSlugAvailable,
  renameTrip,
} from "../../services/firebase/tripRepository";
import { Button } from "../common/Button";
import { LoadingOverlay } from "../common/LoadingOverlay";
import { TextField } from "../common/TextField";
import { buildTripUrl } from "../../utils/tripUrl";

type EditSlugFormProps = {
  ownerId: string;
  currentSlug: string;
  onCancel: () => void;
  onRenamed: (props: { slug: string }) => void;
};

export const EditSlugForm = (props: EditSlugFormProps) => {
  const { ownerId, currentSlug, onCancel, onRenamed } = props;
  const [rawName, setRawName] = useState(currentSlug);
  const previewSlug = normalizeSlug(rawName);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (previewSlug === currentSlug) {
      setError("Esse já é o link atual.");
      return;
    }

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
      await renameTrip({ ownerId, oldSlug: currentSlug, newSlug: previewSlug });
      onRenamed({ slug: previewSlug });
    } catch (renameError) {
      setError(describeFirebaseError(renameError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="edit-slug-form"
      aria-labelledby="edit-slug-form-title"
      onSubmit={handleSubmit}
    >
      <h2 id="edit-slug-form-title" className="edit-slug-form__title">
        Editar link da lista
      </h2>
      <TextField
        error={error}
        value={rawName}
        label="Novo nome da lista"
        onChange={(event) => setRawName(event.target.value)}
        hint={
          previewSlug
            ? `Novo link: ${buildTripUrl(previewSlug)}`
            : undefined
        }
      />
      <div className="edit-slug-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting || previewSlug === ""}
        >
          Salvar novo link
        </Button>
      </div>
      {submitting && <LoadingOverlay message="Salvando novo link..." />}
    </form>
  );
};
