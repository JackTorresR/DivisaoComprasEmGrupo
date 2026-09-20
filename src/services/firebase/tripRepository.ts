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
  type FieldValue,
  type Unsubscribe,
} from "firebase/firestore";
import type { TripData } from "../../domain/types";
import { firestore } from "./firebaseConfig";

const TRIPS_COLLECTION = "trips";
const USERS_COLLECTION = "users";
const USER_TRIPS_SUBCOLLECTION = "trips";

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

const ownedTripDocumentRef = (props: { ownerId: string; slug: string }) =>
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

export const createTrip = async (props: {
  slug: string;
  ownerId: string;
}): Promise<void> => {
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

export const saveTripData = async (props: {
  slug: string;
  data: TripData;
}): Promise<void> => {
  const { slug, data } = props;
  await updateDoc(tripDocumentRef({ slug }), {
    ...data,
    assignments: data.assignments ?? deleteField(),
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToTrip = (props: {
  slug: string;
  onData: (record: TripRecord | null) => void;
  onError: (error: Error) => void;
}): Unsubscribe => {
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
        ownerId: record.ownerId,
        people: record.people,
        products: record.products,
        bindings: record.bindings,
        assignments: record.assignments ?? null,
      });
    },
    onError,
  );
};

export const listOwnedTrips = async (props: {
  ownerId: string;
}): Promise<OwnedTripSummary[]> => {
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
