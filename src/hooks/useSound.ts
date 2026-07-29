import { useEffect } from 'react';
import {
  initAudio,
  unlockAudio,
  playChainSound,
  playCharacterSkillSound,
  playPrizeSound,
  playSound,
  setMuted,
} from '../utils/audioManager';
import { SOUND_CONFIG, VOLUME_CONFIG, type PrizeSoundType } from '../config/soundConfig';

type AudioController = {
  click: () => void;
  paper: () => void;
  modalOpen: () => void;
  modalClose: () => void;
  prize: (soundType?: PrizeSoundType) => void;
  skill: (characterId: string) => void;
  skillAlert: () => void;
  chain: (count: number) => void;
  win: () => void;
  setMuted: (value: boolean) => void;
};

export function useSound(enabled = false): AudioController {
  useEffect(() => {
    initAudio();
    // `music` is the persisted mute flag in the existing game state.
    setMuted(enabled);
  }, [enabled]);

  return {
    click: () => { void unlockAudio(); playSound(SOUND_CONFIG.ui.click, { volume: VOLUME_CONFIG.click }); },
    paper: () => { void unlockAudio(); playSound(SOUND_CONFIG.ui.flip, { volume: VOLUME_CONFIG.flip }); },
    modalOpen: () => playSound(SOUND_CONFIG.ui.modalOpen, { volume: VOLUME_CONFIG.modal }),
    modalClose: () => playSound(SOUND_CONFIG.ui.modalClose, { volume: VOLUME_CONFIG.modal }),
    prize: (soundType = 'default') => playPrizeSound(soundType),
    skill: (characterId) => playCharacterSkillSound(characterId),
    skillAlert: () => playSound(SOUND_CONFIG.ui.skillAlert, { volume: VOLUME_CONFIG.skill }),
    chain: (count) => playChainSound(count),
    win: () => playSound(SOUND_CONFIG.ui.gameComplete, { volume: VOLUME_CONFIG.complete }),
    setMuted,
  };
}
