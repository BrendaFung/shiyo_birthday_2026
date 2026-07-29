import type { Character } from '../types';

export const characters: Character[] = [
  { id: 'oikawa', name: '及川', color: '#8bbbd2', emoji: '🏐', line: '今天也要把好運漂亮地接住！' },
  { id: 'bokuto', name: '木兔', color: '#e9a165', emoji: '🦉', line: 'HEY HEY HEY！生日快樂！' },
  { id: 'kuroo', name: '黑尾', color: '#d7a8bd', emoji: '🐈‍⬛', line: '運氣不錯嘛，繼續保持。' },
  { id: 'bakugo', name: '爆豪', color: '#f1b25d', emoji: '💥', line: '今年也給我拿出全力！' },
  { id: 'todoroki', name: '轟', color: '#a6d3d4', emoji: '❄️', line: '生日快樂。希望願望都能實現。' },
  { id: 'usagi', name: '烏薩琪', color: '#f3c2c4', emoji: '🐰', line: '呀哈～好運全部飛過來！' },
];

export const fixedFirstRoundCharacterIds = ['oikawa', 'bokuto', 'kuroo', 'bakugo', 'todoroki', 'usagi'] as const;
export const firstAwakeningThreshold = 3;

export type CharacterSkill = { id: string; characterId: string; title: string; message: string; autoRevealCount: number };

export const characterSkills: CharacterSkill[] = [
  { id: 'oikawa-serve', characterId: 'oikawa', title: '及川的好運發球', message: '把今天的驚喜，一個不漏地送到你手上！', autoRevealCount: 3 },
  { id: 'bokuto-cheer', characterId: 'bokuto', title: '木兔全力應援', message: 'HEY HEY HEY！一次打開三倍的生日好運！', autoRevealCount: 2 },
  { id: 'kuroo-trick', characterId: 'kuroo', title: '黑尾的幸運小計策', message: '我稍微推了一把，看看驚喜會跑去哪裡。', autoRevealCount: 2 },
  { id: 'bakugo-burst', characterId: 'bakugo', title: '爆豪的全力爆發', message: '別磨蹭，三份好運一次拿走！', autoRevealCount: 3 },
  { id: 'todoroki-balance', characterId: 'todoroki', title: '轟的雙色祝福', message: '冷靜收下這份驚喜，生日快樂。', autoRevealCount: 2 },
  { id: 'usagi-hop', characterId: 'usagi', title: '烏薩琪的幸運跳跳', message: '呀哈～三個驚喜一起跳到你面前！', autoRevealCount: 3 },
];

export const createPrizeCharacterAssignments = (extras: string[]) => {
  const pool = [...fixedFirstRoundCharacterIds.flatMap((id) => Array(8).fill(id)), ...extras];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return Object.fromEntries(pool.map((characterId, index) => [index + 1, characterId]));
};

export const getCharacterSkill = (id: string) => characterSkills.find((skill) => skill.characterId === id);
export const getSkillAutoRevealCount = (skill: CharacterSkill) => ({ oikawa: 4, bokuto: 3, kuroo: 3, bakugo: 4, usagi: 5 } as Record<string, number>)[skill.characterId] ?? skill.autoRevealCount;
export const getRoundForPrize = (prizeId: number): 1 | 2 => prizeId <= 12 ? 1 : 2;
