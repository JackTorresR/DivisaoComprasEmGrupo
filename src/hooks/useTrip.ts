import { useEffect, useRef, useState } from 'react';
import type { TripData } from '../domain/types';
import { describeFirebaseError } from '../services/firebase/firebaseErrors';
import { saveTripData, subscribeToTrip } from '../services/firebase/tripRepository';
import { EMPTY_TRIP_DATA, useAppStore } from '../store/useAppStore';

const AUTO_SAVE_DELAY_MS = 600;

type UseTripProps = {
  slug: string;
  userId: string | null;
};

type TripStatus = 'loading' | 'not-found' | 'ready' | 'error';

const extractTripData = (state: TripData): TripData => ({
  people: state.people,
  products: state.products,
  bindings: state.bindings,
  assignments: state.assignments,
});

export const useTrip = (props: UseTripProps) => {
  const { slug, userId } = props;
  const [status, setStatus] = useState<TripStatus>('loading');
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const skipNextAutoSaveRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOwner = status === 'ready' && userId !== null && ownerId === userId;

  useEffect(() => {
    setStatus('loading');
    setOwnerId(null);
    useAppStore.getState().hydrate(EMPTY_TRIP_DATA);

    return subscribeToTrip({
      slug,
      onData: (record) => {
        if (record === null) {
          setStatus('not-found');
          return;
        }
        skipNextAutoSaveRef.current = true;
        useAppStore.getState().hydrate(extractTripData(record));
        setOwnerId(record.ownerId);
        setStatus('ready');
      },
      onError: (error) => setSaveError(describeFirebaseError(error)),
    });
  }, [slug]);

  useEffect(() => {
    if (!isOwner) return undefined;

    skipNextAutoSaveRef.current = false;

    const unsubscribe = useAppStore.subscribe((state) => {
      if (skipNextAutoSaveRef.current) {
        skipNextAutoSaveRef.current = false;
        return;
      }
      const data = extractTripData(state);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveTripData({ slug, data }).catch((error) => setSaveError(describeFirebaseError(error)));
      }, AUTO_SAVE_DELAY_MS);
    });

    return () => {
      unsubscribe();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [isOwner, slug]);

  return { status, isOwner, saveError };
};
