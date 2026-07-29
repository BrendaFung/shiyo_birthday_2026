export type Phase = 'opening' | 'card' | 'game' | 'complete';
export type Prize = { id: number; name: string };
export type Character = { id: string; name: string; color: string; emoji: string; line: string };
export type BlessingAssignment = { characterId: string; text: string; round: 1 | 2 };
export type SkillTrigger = { characterId: string; skillId: string };
export type SaveState = { phase: Phase; order: number[]; opened: number[]; prizes: number[]; music: boolean; assignments: Record<number, BlessingAssignment>; prizeCharacters: Record<number, string>; characterCounts: Record<string, number>; extraCharacters: string[]; triggeredSkills: string[]; skillQueue: SkillTrigger[]; skillInProgress: boolean; firstAwakeningTriggered: boolean };
