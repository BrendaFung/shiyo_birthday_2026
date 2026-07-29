import type { PrizeSoundType } from './soundConfig';

// Keep prize audio selection independent from the UI. Replace an id here when
// a specific prize needs a different sound without touching components.
const groups: Record<PrizeSoundType, number[]> = {
  plush: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
  accessory: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
  tableware: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
  figure: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
  weapon: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  default: [],
};

const byPrizeId = Object.fromEntries(
  Object.entries(groups).flatMap(([soundType, prizeIds]) => prizeIds.map((id) => [id, soundType])),
) as Record<number, PrizeSoundType>;

export const getPrizeSoundType = (prizeId: number): PrizeSoundType => byPrizeId[prizeId] ?? 'default';
