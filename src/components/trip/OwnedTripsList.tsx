import { useEffect, useState } from "react";
import { describeFirebaseError } from "../../services/firebase/firebaseErrors";
import {
  deleteTrip,
  listOwnedTrips,
  type OwnedTripSummary,
} from "../../services/firebase/tripRepository";
import { Button } from "../common/Button";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { EmptyState } from "../common/EmptyState";
import { LoadingOverlay } from "../common/LoadingOverlay";
import { LoadingState } from "../common/LoadingState";
import { Section } from "../common/Section";
import { EditSlugForm } from "./EditSlugForm";

type OwnedTripsListProps = {
  ownerId: string;
  onOpenTrip: (props: { slug: string }) => void;
};

export const OwnedTripsList = (props: OwnedTripsListProps) => {
  const { ownerId, onOpenTrip } = props;
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<OwnedTripSummary[] | null>(null);

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listOwnedTrips({ ownerId })
      .then((ownedTrips) => {
        if (!cancelled) setTrips(ownedTrips);
      })
      .catch((loadError) => {
        if (!cancelled) setError(describeFirebaseError(loadError));
      });
    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  const handleRenamed = (renamedProps: { slug: string }) => {
    const { slug: novoSlug } = renamedProps;
    setTrips(
      (currentTrips) =>
        currentTrips?.map((trip) =>
          trip.slug === editingSlug ? { ...trip, slug: novoSlug } : trip,
        ) ?? currentTrips,
    );
    setEditingSlug(null);
  };

  const confirmDeletion = async () => {
    if (!confirmDeleteSlug) return;
    const slug = confirmDeleteSlug;
    setConfirmDeleteSlug(null);
    setDeletingSlug(slug);
    setDeleteError(null);
    try {
      await deleteTrip({ slug, ownerId });
      setTrips(
        (currentTrips) =>
          currentTrips?.filter((trip) => trip.slug !== slug) ?? currentTrips,
      );
    } catch (deletionError) {
      setDeleteError(describeFirebaseError(deletionError));
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <Section title="Minhas listas" description="Listas que você já criou.">
      {error && (
        <p className="field__message field__message--error" role="alert">
          {error}
        </p>
      )}
      {deleteError && (
        <p className="field__message field__message--error" role="alert">
          {deleteError}
        </p>
      )}
      {!error && trips === null && <LoadingState />}
      {trips !== null && trips.length === 0 && (
        <EmptyState
          title="Você ainda não criou nenhuma lista"
          description="Crie a primeira lista ao lado."
        />
      )}
      {trips !== null && trips.length > 0 && (
        <ul className="owned-trips">
          {trips.map((trip) => (
            <li key={trip.slug} className="owned-trips__item">
              {editingSlug === trip.slug ? (
                <EditSlugForm
                  ownerId={ownerId}
                  currentSlug={trip.slug}
                  onCancel={() => setEditingSlug(null)}
                  onRenamed={handleRenamed}
                />
              ) : (
                <>
                  <span className="owned-trips__slug">/{trip.slug}</span>
                  <div className="owned-trips__actions">
                    <Button
                      size="sm"
                      onClick={() => onOpenTrip({ slug: trip.slug })}
                    >
                      Abrir
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingSlug(trip.slug)}
                    >
                      Editar link
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setConfirmDeleteSlug(trip.slug)}
                    >
                      Excluir
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {deletingSlug && <LoadingOverlay message="Excluindo lista..." />}
      <ConfirmDialog
        open={confirmDeleteSlug !== null}
        title="Excluir esta lista?"
        onConfirm={confirmDeletion}
        confirmLabel="Excluir lista"
        onCancel={() => setConfirmDeleteSlug(null)}
        confirmacaoObrigatoria={confirmDeleteSlug ?? undefined}
        message="Todos os dados dessa lista serão apagados permanentemente e o link deixará de funcionar. Essa ação não pode ser desfeita."
      />
    </Section>
  );
};
