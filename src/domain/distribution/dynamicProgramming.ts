import { MAX_DYNAMIC_PROGRAMMING_SUM } from './settings';

const greatestCommonDivisor = (a: number, b: number): number => (b === 0 ? a : greatestCommonDivisor(b, a % b));

const markReachableSums = (weights: number[], maxSum: number) => {
  const reachable = new Uint8Array(maxSum + 1);
  const firstItem = new Int32Array(maxSum + 1).fill(-1);
  reachable[0] = 1;
  let runningSum = 0;
  weights.forEach((weight, index) => {
    runningSum += weight;
    for (let sum = runningSum; sum >= weight; sum--) {
      if (!reachable[sum] && reachable[sum - weight]) {
        reachable[sum] = 1;
        firstItem[sum] = index;
      }
    }
  });
  return { reachable, firstItem };
};

const findClosestReachableSum = (reachable: Uint8Array, divisor: number, doubledGoal: number) => {
  let closestSum = 0;
  let closestDistance = Infinity;
  for (let sum = 0; sum < reachable.length; sum++) {
    if (!reachable[sum]) continue;
    const distance = Math.abs(2 * divisor * sum - doubledGoal);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestSum = sum;
    }
  }
  return closestSum;
};

const collectItems = (firstItem: Int32Array, weights: number[], targetSum: number) => {
  const chosen: number[] = [];
  let remaining = targetSum;
  while (remaining > 0) {
    const index = firstItem[remaining];
    chosen.push(index);
    remaining -= weights[index];
  }
  return chosen;
};

export const findSubsetByDynamicProgramming = (weights: number[], doubledGoal: number): number[] | null => {
  const divisor = weights.reduce(greatestCommonDivisor, 0);
  if (divisor === 0) return null;
  const scaledWeights = weights.map((weight) => weight / divisor);
  const maxSum = scaledWeights.reduce((total, weight) => total + weight, 0);
  if (maxSum > MAX_DYNAMIC_PROGRAMMING_SUM) return null;
  const { reachable, firstItem } = markReachableSums(scaledWeights, maxSum);
  const closestSum = findClosestReachableSum(reachable, divisor, doubledGoal);
  return collectItems(firstItem, scaledWeights, closestSum);
};
