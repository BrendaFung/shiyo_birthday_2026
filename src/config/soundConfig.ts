export const SOUND_CONFIG = {
  ui: {
    click: '/audio/ui-click.wav',
    flip: '/audio/card-flip.wav',
    modalOpen: '/audio/modal-open.wav',
    modalClose: '/audio/modal-close.wav',
    skillAlert: '/audio/skill-alert.wav',
    chainStep: '/audio/chain-step.wav',
    chainComplete: '/audio/chain-complete.wav',
    gameComplete: '/audio/game-complete.wav',
  },
  prize: {
    plush: '/audio/prize-plush.wav',
    accessory: '/audio/prize-accessory.wav',
    tableware: '/audio/prize-tableware.wav',
    figure: '/audio/prize-figure.wav',
    weapon: '/audio/prize-weapon.wav',
    default: '/audio/prize-default.wav',
  },
  skill: {
    bakugo: '/audio/skill-bakugo.wav',
    todoroki: '/audio/skill-todoroki.wav',
    kuroo: '/audio/skill-kuroo.wav',
    bokuto: '/audio/skill-bokuto.wav',
    usagi: '/audio/skill-usagi.wav',
    character6: '/audio/skill-character6.wav',
    oikawa: '/audio/skill-character6.wav',
  },
} as const;

export const VOLUME_CONFIG = {
  click: 0.2,
  flip: 0.3,
  modal: 0.4,
  prize: 0.4,
  skill: 0.55,
  chain: 0.35,
  complete: 0.65,
};

export type PrizeSoundType = keyof typeof SOUND_CONFIG.prize;
