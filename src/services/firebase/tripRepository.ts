import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type FieldValue,
  type Unsubscribe,
} from "firebase/firestore";
import type { TripData } from "../../domain/types";
import { firestore } from "./firebaseConfig";

const TRIPS_COLLECTION = "trips";
const USERS_COLLECTION = "users";
const USER_TRIPS_SUBCOLLECTION = "trips";
const RENAME_TRIP_NOT_FOUND_ERROR = "Essa lista não foi encontrada.";

export type TripRecord = TripData & {
  ownerId: string;
};

type StoredTripRecord = TripRecord & {
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type OwnedTripSummary = {
  slug: string;
  createdAtMillis: number | null;
};

const tripDocumentRef = (props: { slug: string }) =>
  doc(firestore, TRIPS_COLLECTION, props.slug);

interface OwnedTripDocumentRefProps {
  slug: string;
  ownerId: string;
}

const ownedTripDocumentRef = (props: OwnedTripDocumentRefProps) =>
  doc(
    firestore,
    USERS_COLLECTION,
    props.ownerId,
    USER_TRIPS_SUBCOLLECTION,
    props.slug,
  );

export const isSlugAvailable = async (props: {
  slug: string;
}): Promise<boolean> => {
  const snapshot = await getDoc(tripDocumentRef({ slug: props.slug }));
  return !snapshot.exists();
};

interface CreateTripProps {
  slug: string;
  ownerId: string;
}

export const createTrip = async (props: CreateTripProps): Promise<void> => {
  const { slug, ownerId } = props;
  const initialRecord: StoredTripRecord = {
    ownerId,
    people: [],
    products: [],
    bindings: [],
    assignments: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(tripDocumentRef({ slug }), initialRecord);
  await setDoc(ownedTripDocumentRef({ ownerId, slug }), {
    slug,
    createdAt: serverTimestamp(),
  });
};

interface SaveTripDataProps {
  slug: string;
  data: TripData;
}

export const saveTripData = async (props: SaveTripDataProps): Promise<void> => {
  const { slug, data } = props;
  await updateDoc(tripDocumentRef({ slug }), {
    ...data,
    assignments: data.assignments ?? deleteField(),
    updatedAt: serverTimestamp(),
  });
};

interface SubscribeToTripProps {
  slug: string;
  onError: (error: Error) => void;
  onData: (record: TripRecord | null) => void;
}

export const subscribeToTrip = (props: SubscribeToTripProps): Unsubscribe => {
  const { slug, onData, onError } = props;
  return onSnapshot(
    tripDocumentRef({ slug }),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }
      const record = snapshot.data() as StoredTripRecord;
      onData({
        people: record.people,
        ownerId: record.ownerId,
        products: record.products,
        bindings: record.bindings,
        assignments: record.assignments ?? null,
      });
    },
    onError,
  );
};

interface ListOwnedTripsProps {
  ownerId: string;
}

export const listOwnedTrips = async (
  props: ListOwnedTripsProps,
): Promise<OwnedTripSummary[]> => {
  const snapshot = await getDocs(
    collection(
      firestore,
      USERS_COLLECTION,
      props.ownerId,
      USER_TRIPS_SUBCOLLECTION,
    ),
  );
  return snapshot.docs
    .map((tripDoc) => {
      const data = tripDoc.data() as {
        slug: string;
        createdAt: { toMillis: () => number } | null;
      };
      return {
        slug: data.slug,
        createdAtMillis: data.createdAt?.toMillis() ?? null,
      };
    })
    .sort(
      (first, second) =>
        (second.createdAtMillis ?? 0) - (first.createdAtMillis ?? 0),
    );
};

interface DeleteTripProps {
  slug: string;
  ownerId: string;
}

export const deleteTrip = async (props: DeleteTripProps): Promise<void> => {
  const { slug, ownerId } = props;
  const batch = writeBatch(firestore);
  batch.delete(tripDocumentRef({ slug }));
  batch.delete(ownedTripDocumentRef({ ownerId, slug }));
  await batch.commit();
};

interface RenameTripProps {
  ownerId: string;
  oldSlug: string;
  newSlug: string;
}

export const renameTrip = async (props: RenameTripProps): Promise<void> => {
  const { ownerId, oldSlug, newSlug } = props;
  const currentSnapshot = await getDoc(tripDocumentRef({ slug: oldSlug }));
  if (!currentSnapshot.exists()) {
    throw new Error(RENAME_TRIP_NOT_FOUND_ERROR);
  }
  const currentRecord = currentSnapshot.data() as StoredTripRecord;

  const batch = writeBatch(firestore);
  batch.set(tripDocumentRef({ slug: newSlug }), {
    ...currentRecord,
    updatedAt: serverTimestamp(),
  });
  batch.set(ownedTripDocumentRef({ ownerId, slug: newSlug }), {
    slug: newSlug,
    createdAt: serverTimestamp(),
  });
  batch.delete(tripDocumentRef({ slug: oldSlug }));
  batch.delete(ownedTripDocumentRef({ ownerId, slug: oldSlug }));
  await batch.commit();
};
