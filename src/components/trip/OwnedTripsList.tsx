import { useEffect, useState } from "react";
import { describeFirebaseError } from "../../services/firebase/firebaseErrors";
import {
  listOwnedTrips,
  type OwnedTripSummary,
} from "../../services/firebase/tripRepository";
import { Button } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
import { Section } from "../common/Section";

type OwnedTripsListProps = {
  ownerId: string;
  onOpenTrip: (props: { slug: string }) => void;
};

export const OwnedTripsList = (props: OwnedTripsListProps) => {
  const { ownerId, onOpenTrip } = props;
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<OwnedTripSummary[] | null>(null);

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

  return (
    <Section title="Minhas listas" description="Listas que você já criou.">
      {error && (
        <p className="field__message field__message--error" role="alert">
          {error}
        </p>
      )}
      {!error && trips === null && (
        <p className="card__description">Carregando…</p>
      )}
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
              <span className="owned-trips__slug">/{trip.slug}</span>
              <Button size="sm" onClick={() => onOpenTrip({ slug: trip.slug })}>
                Abrir
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};
