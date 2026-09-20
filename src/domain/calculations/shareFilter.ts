import { normalizeText } from "../../utils/normalizeText";
import type { PersonShare } from "./summary";

export type PositionFilter = "all" | "above" | "below";

export type ShareFilter = {
  query: string;
  position: PositionFilter;
};

export const EMPTY_SHARE_FILTER: ShareFilter = { query: "", position: "all" };

export const isShareFilterActive = (filter: ShareFilter) =>
  filter.query.trim() !== "" || filter.position !== "all";

const matchesQuery = (share: PersonShare, query: string) => {
  const name = normalizeText(share.person.name);
  return normalizeText(query)
    .split(/\s+/)
    .every((term) => name.includes(term));
};

const matchesPosition = (share: PersonShare, position: PositionFilter) => {
  if (position === "above") return share.differenceCents > 0;
  if (position === "below") return share.differenceCents < 0;
  return true;
};

export const filterShares = (
  shares: PersonShare[],
  filter: ShareFilter,
): PersonShare[] =>
  shares.filter(
    (share) =>
      matchesQuery(share, filter.query) &&
      matchesPosition(share, filter.position),
  );
