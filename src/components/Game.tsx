import { AnimatePresence, motion } from 'framer-motion';
import type { Character } from '../types';
import { Header } from './Header';
import { PunchCard } from './PunchCard';
import { RewardModal } from './RewardModal';
import { PaperTexture } from './PaperTexture';
import { imageMap } from '../config/imageMap';

export function Game({ order, opened, onOpen, count, characters, reveal, onCloseReveal, music, onMusic, skillMessage, skillRunning }: {
  order: number[];
  opened: number[];
  onOpen: (index: number) => void;
  count: number;
  characters: Character[];
  reveal: { prizeId: number; prizeName: string; character: Character; blessing?: string; round?: 1 | 2 } | null;
  onCloseReveal: () => void;
  music: boolean;
  onMusic: () => void;
  skillMessage: { title: string; message: string } | null;
  skillRunning: boolean;
}) {
  return <main className="game-page page">
    <PaperTexture />
    <Header count={count} characters={characters} music={music} onMusic={onMusic} />
    <div className="game-hero-row">
      <motion.section className="game-intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <span className="eyebrow">LUCKY PUNCH CARD</span>
        <h1>今天的好運，<br /><em>由你戳開</em>☝</h1>
        <p>每一格都是一個小小的驚喜，正在等你親手發現。</p>
      </motion.section>
      <div className="mascot static-mascot">
        <img src={imageMap.headerImage} alt="烏薩琪" />
        <span>幸運陪伴中</span>
      </div>
    </div>
    <PunchCard order={order} opened={opened} onOpen={onOpen} disabled={Boolean(reveal) || skillRunning} />
    <p className="tap-hint">點擊格子，看看今天的好運吧！</p>
    <AnimatePresence>
      {skillMessage && <motion.div className="skill-toast skill-notification" role="status" aria-live="polite" initial={{ opacity: 0, y: 18, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}>
        <div className="skill-notification__content">
          <div className="skill-notification__text">
            <span className="skill-notification__title">SKILL AWAKENED</span>
            <strong className="skill-notification__skill-name">{skillMessage.title}</strong>
            <small className="skill-notification__description">{skillMessage.message}</small>
          </div>
        </div>
      </motion.div>}
      {reveal && <RewardModal {...reveal} onClose={onCloseReveal} />}
    </AnimatePresence>
  </main>;
}
