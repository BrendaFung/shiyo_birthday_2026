import { motion } from 'framer-motion';
import { getCharacterCrop } from '../config/imageMap';
import type { Character } from '../types';
export function CharacterBadge({ character, small = false, round = 1 }: { character: Character; small?: boolean; round?: 1 | 2 }) { const crop = getCharacterCrop(character.id, round); return <motion.div className={`character ${small ? 'character-small' : ''}`} style={{ background: character.color }} initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} exit={{ opacity: 0, y: -12 }}><span className="character-image" style={{ backgroundImage: `url("${crop.sourceImage}")`, backgroundPosition: crop.objectPosition }} aria-label={character.name} />{!small && <div><b>{character.name}</b><small>{character.line}</small></div>}</motion.div>; }
