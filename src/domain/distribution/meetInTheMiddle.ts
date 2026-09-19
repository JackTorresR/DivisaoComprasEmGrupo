const listSubsetSums = (weights: number[]) => {
  const sums = new Float64Array(1 << weights.length);
  for (let mask = 1; mask < sums.length; mask++) {
    const lowestBit = mask & -mask;
    sums[mask] = sums[mask ^ lowestBit] + weights[31 - Math.clz32(lowestBit)];
  }
  return sums;
};

const sortMasksBySum = (sums: Float64Array) =>
  Uint32Array.from({ length: sums.length }, (_, mask) => mask).sort((a, b) => sums[a] - sums[b]);

const findFirstNotBelow = (sums: Float64Array, sortedMasks: Uint32Array, target: number) => {
  let low = 0;
  let high = sortedMasks.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (sums[sortedMasks[middle]] < target) low = middle + 1;
    else high = middle;
  }
  return low;
};

const listMaskIndexes = (mask: number, offset: number) => {
  const indexes: number[] = [];
  for (let bit = 0; mask >>> bit > 0; bit++) {
    if ((mask >>> bit) & 1) indexes.push(offset + bit);
  }
  return indexes;
};

export const findSubsetByMeetInTheMiddle = (weights: number[], doubledGoal: number): number[] => {
  const middle = weights.length >>> 1;
  const leftSums = listSubsetSums(weights.slice(0, middle));
  const rightSums = listSubsetSums(weights.slice(middle));
  const rightMasks = sortMasksBySum(rightSums);

  let bestDistance = Infinity;
  let bestLeft = 0;
  let bestRight = 0;
  for (let leftMask = 0; leftMask < leftSums.length; leftMask++) {
    const target = doubledGoal / 2 - leftSums[leftMask];
    const upper = findFirstNotBelow(rightSums, rightMasks, target);
    [upper - 1, upper].forEach((position) => {
      if (position < 0 || position >= rightMasks.length) return;
      const rightMask = rightMasks[position];
      const distance = Math.abs(2 * (leftSums[leftMask] + rightSums[rightMask]) - doubledGoal);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestLeft = leftMask;
        bestRight = rightMask;
      }
    });
  }
  return [...listMaskIndexes(bestLeft, 0), ...listMaskIndexes(bestRight, middle)];
};
