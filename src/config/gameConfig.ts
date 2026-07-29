import type { Character } from '../types';
export const characters: Character[] = [{ id: 'oikawa', name: '及川', color: '#8bbbd2', emoji: '🏐', line: '生日快樂，今天的好運都要接住喔！' }, { id: 'bokuto', name: '木兔', color: '#e9a165', emoji: '🦉', line: 'HEY HEY HEY！' }, { id: 'kuroo', name: '黑尾', color: '#d7a8bd', emoji: '🐈‍⬛', line: '運氣不錯嘛。' }, { id: 'bakugo', name: '爆豪', color: '#f1b25d', emoji: '🔥', line: '喂！抽到了啦！' }, { id: 'todoroki', name: '轟', color: '#a6d3d4', emoji: '❄️', line: '生日快樂。' }, { id: 'usagi', name: '烏薩琪', color: '#f3c2c4', emoji: '🐰', line: '呀哈～' }];
export const fixedFirstRoundCharacterIds = ['oikawa', 'bokuto', 'kuroo', 'bakugo', 'todoroki', 'usagi'] as const;
export const getRoundForPrize = (prizeId: number): 1 | 2 => prizeId <= 12 ? 1 : 2;
