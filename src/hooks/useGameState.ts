import { useCallback, useEffect, useRef, useState } from 'react';
import prizes from '../data/prizes.json';
import { createPrizeCharacterAssignments, firstAwakeningThreshold, fixedFirstRoundCharacterIds } from '../config/gameConfig';
import { createBlessingAssignments, validateBlessingAssignments } from '../utils/blessingAssignments';
import { shuffle } from '../utils/shuffle';
import { clearState, readState, writeState } from '../utils/storage';
import type { Phase, SaveState, SkillTrigger } from '../types';

const fresh = (phase: Phase = 'opening'): SaveState => {
  const extraCharacters = shuffle([...fixedFirstRoundCharacterIds]).slice(0, 2);
  const prizeCharacters = createPrizeCharacterAssignments(extraCharacters);
  const characterCounts = Object.fromEntries(fixedFirstRoundCharacterIds.map((id) => [id, 0]));

  return {
    phase,
    order: shuffle(prizes.map((prize) => prize.id)),
    opened: [],
    prizes: [],
    music: false,
    assignments: createBlessingAssignments(),
    prizeCharacters,
    characterCounts,
    extraCharacters,
    triggeredSkills: [],
    skillQueue: [],
    skillInProgress: false,
    firstAwakeningTriggered: false,
    twiceThresholdSkillCount: 0,
    skillActivationCounts: Object.fromEntries(fixedFirstRoundCharacterIds.map((id) => [id, 0])),
    protectedSkillCharacters: [],
    specialSkill12Triggered: false,
    specialSkill26Triggered: false,
  };
};

export function useGameState() {
  const [state, setState] = useState<SaveState>(() => {
    const saved = readState();
    if (!saved?.assignments || !saved.prizeCharacters || !saved.characterCounts || !validateBlessingAssignments(saved.assignments)) {
      return fresh();
    }

    // Recover a session that was refreshed while the previous skill animation was running.
    return saved.skillInProgress ? { ...saved, skillInProgress: false } : saved;
  });
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const save = useCallback((next: SaveState) => {
    stateRef.current = next;
    setState(next);
    writeState(next);
  }, []);

  const setPhase = (phase: Phase) => save({ ...stateRef.current, phase });

  const openCell = (cell: number, fromSkill = false) => {
    const current = stateRef.current;
    if (current.opened.includes(cell) || (current.skillInProgress && !fromSkill)) return;

    const prizeId = current.order[cell];
    const characterId = current.prizeCharacters[prizeId];
    const counts = {
      ...current.characterCounts,
      [characterId]: (current.characterCounts[characterId] ?? 0) + 1,
    };
    const queued = [...current.skillQueue];
    const triggered = [...current.triggeredSkills];
    let firstAwakeningTriggered = current.firstAwakeningTriggered;
    let twiceThresholdSkillCount = current.twiceThresholdSkillCount ?? 0;
    const skillActivationCounts = { ...(current.skillActivationCounts ?? {}) };
    const protectedSkillCharacters = [...(current.protectedSkillCharacters ?? [])];
    let specialSkill12Triggered = current.specialSkill12Triggered ?? false;
    let specialSkill26Triggered = current.specialSkill26Triggered ?? false;

    const queueCharacterSkill = (id: string, allowRepeat = false, protect = false) => {
      const skillId = `${id}-skill`;
      const activationCount = skillActivationCounts[id] ?? 0;
      const maxActivations = allowRepeat ? 2 : 1;
      if (activationCount >= maxActivations) return false;
      if (!allowRepeat && triggered.includes(skillId)) return false;
      if (allowRepeat && protectedSkillCharacters.includes(id)) return false;
      queued.push({ characterId: id, skillId, allowRepeat });
      skillActivationCounts[id] = activationCount + 1;
      if (!triggered.includes(skillId)) triggered.push(skillId);
      if (protect && !protectedSkillCharacters.includes(id)) protectedSkillCharacters.push(id);
      return true;
    };

    // Rule 1: the first character to appear three times awakens.
    if (!firstAwakeningTriggered && counts[characterId] >= firstAwakeningThreshold) {
      if (queueCharacterSkill(characterId, false, true)) firstAwakeningTriggered = true;
    }

    // Rule 2: from the 40th opened card onward, use the first character
    // whose skill has not already been triggered.
    const openedCount = current.opened.length + 1;
    // Rule 4: the character on the fourth opened card gets a skill if available.
    if (openedCount === 4) {
      queueCharacterSkill(characterId, false, true);
    }
    if (openedCount >= 40) {
      queueCharacterSkill(characterId);
    }

    // Rule 3: when every character has appeared twice, trigger the character
    // on this card if it is still available. This is the last character rule.
    const everyoneAppearedTwice = fixedFirstRoundCharacterIds.every((id) => (counts[id] ?? 0) >= 2);
    if (everyoneAppearedTwice && twiceThresholdSkillCount < 2) {
      if (queueCharacterSkill(characterId, true)) twiceThresholdSkillCount += 1;
    }

    // If the first 11 cards only awakened one unique character, the 12th
    // card gets a repeatable skill activation (unless protected by rules 1/4).
    if (openedCount === 12 && triggered.length === 1 && !specialSkill12Triggered) {
      queueCharacterSkill(characterId, true);
      specialSkill12Triggered = true;
    }

    // If the first 25 cards only awakened three unique characters, the 26th
    // card gets a repeatable skill activation (unless protected by rules 1/4).
    if (openedCount === 26 && triggered.length === 3 && !specialSkill26Triggered) {
      queueCharacterSkill(characterId, true);
      specialSkill26Triggered = true;
    }

    save({
      ...current,
      opened: [...current.opened, cell],
      prizes: [...current.prizes, prizeId],
      characterCounts: counts,
      skillQueue: queued,
      triggeredSkills: triggered,
      firstAwakeningTriggered,
      twiceThresholdSkillCount,
      skillActivationCounts,
      protectedSkillCharacters,
      specialSkill12Triggered,
      specialSkill26Triggered,
    });
    return prizeId;
  };

  const randomUnopenedCell = () => {
    const current = stateRef.current;
    const available = current.order.map((_, index) => index).filter((index) => !current.opened.includes(index));
    return available.length ? available[Math.floor(Math.random() * available.length)] : null;
  };

  const beginNextSkill = (): SkillTrigger | null => {
    const current = stateRef.current;
    const next = current.skillQueue[0];
    if (!next || current.skillInProgress) return null;
    save({ ...current, skillQueue: current.skillQueue.slice(1), skillInProgress: true });
    return next;
  };

  const finishSkill = () => save({ ...stateRef.current, skillInProgress: false });
  const restart = () => save(fresh('game'));
  const restartToHome = () => save(fresh('opening'));
  const finish = () => save({ ...stateRef.current, phase: 'complete' });
  const toggleMusic = () => save({ ...stateRef.current, music: !stateRef.current.music });
  const reset = () => {
    clearState();
    save(fresh());
  };

  return {
    state,
    setPhase,
    openCell,
    randomUnopenedCell,
    beginNextSkill,
    finishSkill,
    restart,
    restartToHome,
    finish,
    toggleMusic,
    reset,
    assignmentForPrize: (id: number) => state.assignments[id],
    characterForPrize: (id: number) => state.prizeCharacters[id],
  };
}
