import { Howl, Howler } from 'howler';
import { SOUND_CONFIG, VOLUME_CONFIG, type PrizeSoundType } from '../config/soundConfig';

type SoundName = string;
type PlayOptions = { volume?: number; rate?: number; loop?: boolean };
const MUTED_KEY = 'shiyo_audio_muted';
const sounds = new Map<SoundName, Howl>();
let initialized = false;
let muted = false;

const allSources = Object.values(SOUND_CONFIG).flatMap((group) => Object.values(group));

function readMuted() {
  try {
    return window.localStorage.getItem(MUTED_KEY) === 'true';
  } catch {
    return false;
  }
}

function getHowl(name: SoundName, source: string) {
  const existing = sounds.get(name);
  if (existing) return existing;
  const howl = new Howl({ src: [source], preload: true, volume: 1 });
  sounds.set(name, howl);
  return howl;
}

export function initAudio() {
  if (initialized) return;
  initialized = true;
  muted = readMuted();
  Howler.mute(muted);
  preloadAudio();
}

export function preloadAudio() {
  Object.entries(SOUND_CONFIG).forEach(([groupName, group]) => {
    Object.entries(group).forEach(([soundName, source]) => getHowl(`${groupName}.${soundName}`, source));
  });
}

export function playSound(name: SoundName, options: PlayOptions = {}) {
  if (!initialized) initAudio();
  const sourceIndex = allSources.findIndex((source) => source === name);
  if (sourceIndex < 0) return;
  const source = allSources[sourceIndex];
  const howl = getHowl(name, source);
  howl.volume(options.volume ?? 1);
  howl.rate(options.rate ?? 1);
  howl.loop(Boolean(options.loop));
  try {
    howl.play();
  } catch (error) {
    console.warn('[audio] play failed', error);
  }
}

export function playPrizeSound(soundType: PrizeSoundType = 'default') {
  const source = SOUND_CONFIG.prize[soundType] ?? SOUND_CONFIG.prize.default;
  playSound(source, { volume: VOLUME_CONFIG.prize });
}

export function playCharacterSkillSound(characterId: string) {
  const source = SOUND_CONFIG.skill[characterId as keyof typeof SOUND_CONFIG.skill] ?? SOUND_CONFIG.skill.character6;
  playSound(source, { volume: VOLUME_CONFIG.skill });
}

export function playChainSound(chainCount: number) {
  const source = chainCount <= 1 ? SOUND_CONFIG.ui.chainComplete : SOUND_CONFIG.ui.chainStep;
  const rate = chainCount >= 5 ? Math.min(1.08, 0.95 + chainCount * 0.01) : 1;
  playSound(source, { volume: VOLUME_CONFIG.chain, rate });
}

export function stopSound(name: SoundName) {
  sounds.get(name)?.stop();
}

export function stopAllSounds() {
  sounds.forEach((sound) => sound.stop());
}

export function setMuted(value: boolean) {
  muted = value;
  if (!initialized) initAudio();
  Howler.mute(value);
  try {
    window.localStorage.setItem(MUTED_KEY, String(value));
  } catch {
    // Storage can be unavailable in private browsing; audio still works.
  }
}

export function getMuted() {
  return muted || readMuted();
}

export function isAudioInitialized() {
  return initialized;
}
