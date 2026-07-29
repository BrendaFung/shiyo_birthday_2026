import headerImage from '../assets/images/cards/黑尾木兔 (1).png';
import openingBanner from '../assets/images/cards/烏薩琪2.PNG';
import completionImage from '../assets/images/cards/我英5.PNG';
import usagiHeader from '../assets/images/cards/usagi4-cutout.png';
import usagiAnimated from '../assets/images/cards/烏薩琪_動.gif';
import oikawaHuman from '../assets/images/cards/及川_人.PNG';
import oikawaAnimal from '../assets/images/cards/及川_動物.PNG';
import bokutoHuman from '../assets/images/cards/木兔_人.PNG';
import bokutoAnimal from '../assets/images/cards/木兔_動物.PNG';
import kurooHuman from '../assets/images/cards/黑尾_人.PNG';
import kurooAnimal from '../assets/images/cards/黑尾_動物.PNG';
import bakugoHuman from '../assets/images/cards/爆豪_人.PNG';
import bakugoAnimal from '../assets/images/cards/爆豪_動物.PNG';
import todorokiHuman from '../assets/images/cards/轟_人.PNG';
import todorokiAnimal from '../assets/images/cards/轟_動物.PNG';
import usagiHuman from '../assets/images/cards/烏薩琪_人.PNG';
import usagiBirthday from '../assets/images/cards/usagi-birthday-clean.png';

export type CharacterCrop = { id: string; name: string; sourceImage: string; objectPosition?: string; crop: { x: number; y: number; width: number; height: number }; scale?: number; translateX?: number; translateY?: number; isComposite?: boolean };
export const imageMap = { headerImage, openingBanner, completionImage, usagiHeader, usagiAnimated, oikawaHuman, oikawaAnimal, bokutoHuman, bokutoAnimal, kurooHuman, kurooAnimal, bakugoHuman, bakugoAnimal, todorokiHuman, todorokiAnimal, usagiHuman, usagiBirthday };

const imagePairs: Record<string, { name: string; first: string; second: string }> = {
  oikawa: { name: '及川', first: oikawaHuman, second: oikawaAnimal },
  bokuto: { name: '木兔', first: bokutoHuman, second: bokutoAnimal },
  kuroo: { name: '黑尾', first: kurooHuman, second: kurooAnimal },
  bakugo: { name: '爆豪', first: bakugoHuman, second: bakugoAnimal },
  todoroki: { name: '轟', first: todorokiHuman, second: todorokiAnimal },
  usagi: { name: '烏薩琪', first: usagiHuman, second: usagiBirthday },
};

export const characterCrops: CharacterCrop[] = Object.entries(imagePairs).map(([id, pair]) => ({ id, name: pair.name, sourceImage: pair.first, objectPosition: 'center center', crop: { x: 0, y: 0, width: 1, height: 1 }, scale: 1, translateX: 0, translateY: 0, isComposite: false }));
export const getCharacterCrop = (id: string, round: 1 | 2 = 1): CharacterCrop => { const pair = imagePairs[id] ?? imagePairs.usagi; const base = characterCrops.find((item) => item.id === (imagePairs[id] ? id : 'usagi'))!; return { ...base, sourceImage: round === 1 ? pair.first : pair.second }; };
