import { findSubsetByDynamicProgramming } from './dynamicProgramming';
import { findSubsetByMeetInTheMiddle } from './meetInTheMiddle';
import { MAX_MEET_IN_THE_MIDDLE_ITEMS } from './settings';

export const findSubsetClosestToDoubledGoal = (weights: number[], doubledGoal: number): number[] | null =>
  weights.length <= MAX_MEET_IN_THE_MIDDLE_ITEMS
    ? findSubsetByMeetInTheMiddle(weights, doubledGoal)
    : findSubsetByDynamicProgramming(weights, doubledGoal);
